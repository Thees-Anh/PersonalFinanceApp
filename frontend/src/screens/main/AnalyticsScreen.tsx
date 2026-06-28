import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { getMonthlySummary, getWeeklyTrends } from '../../api/analytics';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { PieChart, BarChart } from 'react-native-gifted-charts';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useTranslation } from '../../utils/i18n';

export default function AnalyticsScreen() {
  const { colors, theme } = useTheme();
  const { currency } = useSettingsStore();
  const { t, tCategory } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const [summaryData, trendsData] = await Promise.all([
        getMonthlySummary(now.getMonth() + 1, now.getFullYear()),
        getWeeklyTrends()
      ]);
      setSummary(summaryData);
      setTrends(trendsData);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: error.response?.data?.message || 'Failed to fetch analytics',
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading || !summary) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const pieData = summary.expenseBreakdown.map((item: any) => ({
    value: item.total,
    color: item.categoryColor || colors.expense,
    text: tCategory(item.categoryName),
  }));

  const barData: any[] = [];
  trends.forEach((t) => {
    barData.push({
      value: t.income,
      label: t.dayName,
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: colors.textSecondary, fontSize: 10 },
      frontColor: colors.income,
    });
    barData.push({
      value: t.expense,
      frontColor: colors.expense,
    });
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <Text style={[styles.header, { color: colors.text }]}>{t('analytics_title')}</Text>
      
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('expense_breakdown')}</Text>
        {pieData.length > 0 ? (
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <PieChart
              data={pieData}
              donut
              radius={90}
              innerRadius={60}
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
              {pieData.map((item: any, index: number) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8, marginBottom: 8 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: item.color, marginRight: 6 }} />
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Text style={{ color: colors.textSecondary, textAlign: 'center', marginVertical: 20 }}>
            {t('no_expenses')}
          </Text>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('income_vs_expense')}</Text>
        {trends.length > 0 ? (
          <View style={{ marginTop: 20, paddingBottom: 20 }}>
            <BarChart
              data={barData}
              barWidth={12}
              spacing={24}
              roundedTop
              xAxisThickness={1}
              yAxisThickness={0}
              yAxisTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
              noOfSections={4}
              rulesColor={colors.border}
              yAxisLabelPrefix={currency === 'USD' ? '$' : ''}
              yAxisLabelSuffix={currency === 'VND' ? 'đ' : ''}
              formatYLabel={(label) => {
                const val = Number(label);
                if (currency === 'VND') return (val / 1000).toFixed(0) + 'k';
                return label;
              }}
              isAnimated
            />
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.income, marginRight: 6 }} />
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{t('income')}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.expense, marginRight: 6 }} />
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{t('expense')}</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={{ color: colors.textSecondary, textAlign: 'center', marginVertical: 20 }}>
            {t('no_data')}
          </Text>
        )}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', marginLeft: 20, marginBottom: 20 },
  card: { marginHorizontal: 20, marginBottom: 20, padding: 16, borderRadius: 16, borderWidth: 1 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
});
