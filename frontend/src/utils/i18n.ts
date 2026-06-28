import { useSettingsStore } from '../store/useSettingsStore';

const translations = {
  en: {
    // Tabs
    tab_home: 'Home',
    tab_add: 'Add',
    tab_transactions: 'Transactions',
    tab_analytics: 'Analytics',
    tab_profile: 'Profile',

    // Dashboard
    total_balance: 'Total Balance',
    income: 'Income',
    expense: 'Expense',
    recent_transactions: 'Recent Transactions',
    view_all: 'View All',
    no_recent: 'No recent transactions',
    delete_transaction: 'Delete Transaction',
    delete_confirm: 'Are you sure you want to delete this transaction?',
    delete: 'Delete',
    success: 'Success',
    error: 'Error',
    transaction_deleted: 'Transaction deleted',
    failed_delete: 'Failed to delete',

    // Transactions
    search_transactions: 'Search transactions...',
    no_transactions_found: 'No transactions found.',

    // Add Transaction
    add_transaction: 'Add Transaction',
    type: 'Type',
    amount: 'Amount',
    category: 'Category',
    date: 'Date',
    note: 'Note',
    save: 'Save',
    saving: 'Saving...',
    select_category: 'Select Category',
    please_enter_amount: 'Please enter an amount',
    please_select_category: 'Please select a category',
    transaction_added: 'Transaction added successfully',

    // Analytics
    analytics_title: 'Analytics',
    expense_breakdown: 'Expense Breakdown',
    income_vs_expense: 'Income vs Expense (7 Days)',
    no_expenses: 'No expenses this month.',
    no_data: 'No data available.',

    // Profile Screen
    profile_title: 'Profile',
    account: 'ACCOUNT',
    edit_profile: 'Edit Profile',
    change_password: 'Change Password',
    notifications: 'Notifications',
    preferences: 'PREFERENCES',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    currency: 'Currency',
    language: 'Language',
    support: 'SUPPORT',
    help_center: 'Help Center',
    terms: 'Terms & Conditions',
    log_out: 'Log Out',
    log_out_confirm: 'Are you sure you want to log out?',
    cancel: 'Cancel',

    // Edit Profile Modal
    edit_profile_title: 'Edit Profile',
    name: 'Name',
    close: 'Close',

    // Change Password Modal
    change_password_title: 'Change Password',
    old_password: 'Old Password',
    new_password: 'New Password',

    // Categories
    cat_food: 'Food',
    cat_transport: 'Transport',
    cat_entertainment: 'Entertainment',
    cat_shopping: 'Shopping',
    cat_health: 'Health',
    cat_salary: 'Salary',
    cat_investment: 'Investment',

    // Budget
    tab_budget: 'Budget',
    monthly_budgets: 'Monthly Budgets',
    add_budget: 'Add Budget',
    budget_limit: 'Limit',
    spent: 'Spent',
    remaining: 'Remaining',
    exceeded_budget: 'You have exceeded your budget for this category!',
    no_budgets: 'No budgets found for this month.',
    select_category: 'Select Category',
    limit_amount: 'Limit Amount',
    budget_added: 'Budget added successfully',
    budget_updated: 'Budget updated successfully',
    delete_budget: 'Delete Budget',
    delete_budget_confirm: 'Are you sure you want to delete this budget?',
    edit_budget: 'Edit Budget',
  },
  vi: {
    // Tabs
    tab_home: 'Trang chủ',
    tab_add: 'Thêm',
    tab_transactions: 'Giao dịch',
    tab_analytics: 'Thống kê',
    tab_profile: 'Hồ sơ',

    // Dashboard
    total_balance: 'Tổng số dư',
    income: 'Thu nhập',
    expense: 'Chi tiêu',
    recent_transactions: 'Giao dịch gần đây',
    view_all: 'Xem tất cả',
    no_recent: 'Chưa có giao dịch nào',
    delete_transaction: 'Xóa giao dịch',
    delete_confirm: 'Bạn có chắc chắn muốn xóa giao dịch này không?',
    delete: 'Xóa',
    success: 'Thành công',
    error: 'Lỗi',
    transaction_deleted: 'Đã xóa giao dịch',
    failed_delete: 'Xóa thất bại',

    // Transactions
    search_transactions: 'Tìm kiếm giao dịch...',
    no_transactions_found: 'Không tìm thấy giao dịch nào.',

    // Add Transaction
    add_transaction: 'Thêm giao dịch',
    type: 'Loại',
    amount: 'Số tiền',
    category: 'Danh mục',
    date: 'Ngày',
    note: 'Ghi chú',
    save: 'Lưu',
    saving: 'Đang lưu...',
    select_category: 'Chọn danh mục',
    please_enter_amount: 'Vui lòng nhập số tiền',
    please_select_category: 'Vui lòng chọn danh mục',
    transaction_added: 'Thêm giao dịch thành công',

    // Analytics
    analytics_title: 'Thống kê',
    expense_breakdown: 'Phân bổ chi tiêu',
    income_vs_expense: 'Thu nhập và Chi tiêu (7 Ngày)',
    no_expenses: 'Không có khoản chi tiêu nào trong tháng này.',
    no_data: 'Không có dữ liệu.',

    // Profile Screen
    profile_title: 'Hồ sơ cá nhân',
    account: 'TÀI KHOẢN',
    edit_profile: 'Chỉnh sửa hồ sơ',
    change_password: 'Đổi mật khẩu',
    notifications: 'Thông báo',
    preferences: 'TÙY CHỈNH',
    theme: 'Giao diện',
    dark: 'Tối',
    light: 'Sáng',
    currency: 'Tiền tệ',
    language: 'Ngôn ngữ',
    support: 'HỖ TRỢ',
    help_center: 'Trung tâm trợ giúp',
    terms: 'Điều khoản & Điều kiện',
    log_out: 'Đăng xuất',
    log_out_confirm: 'Bạn có chắc chắn muốn đăng xuất không?',
    cancel: 'Hủy',

    // Edit Profile Modal
    edit_profile_title: 'Chỉnh sửa hồ sơ',
    name: 'Họ và tên',
    close: 'Đóng',

    // Change Password Modal
    change_password_title: 'Đổi mật khẩu',
    old_password: 'Mật khẩu cũ',
    new_password: 'Mật khẩu mới',

    // Categories
    cat_food: 'Ăn uống',
    cat_transport: 'Di chuyển',
    cat_entertainment: 'Giải trí',
    cat_shopping: 'Mua sắm',
    cat_health: 'Sức khỏe',
    cat_salary: 'Lương',
    cat_investment: 'Đầu tư',

    // Budget
    tab_budget: 'Ngân sách',
    monthly_budgets: 'Ngân sách tháng',
    add_budget: 'Thêm ngân sách',
    budget_limit: 'Giới hạn',
    spent: 'Đã tiêu',
    remaining: 'Còn lại',
    exceeded_budget: 'Bạn đã vượt quá ngân sách cho danh mục này!',
    no_budgets: 'Chưa có ngân sách nào trong tháng này.',
    select_category: 'Chọn danh mục',
    limit_amount: 'Số tiền giới hạn',
    budget_added: 'Thêm ngân sách thành công',
    budget_updated: 'Cập nhật ngân sách thành công',
    delete_budget: 'Xóa ngân sách',
    delete_budget_confirm: 'Bạn có chắc chắn muốn xóa ngân sách này không?',
    edit_budget: 'Sửa ngân sách',
  }
};

export function useTranslation() {
  const { language } = useSettingsStore();

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  const tCategory = (name: string): string => {
    if (!name) return '';
    const key = `cat_${name.toLowerCase()}` as keyof typeof translations.en;
    return t(key) !== key ? t(key) : name;
  };

  return { t, tCategory, language };
}
