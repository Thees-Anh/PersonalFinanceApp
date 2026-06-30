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
    limit_amount: 'Limit Amount',
    budget_added: 'Budget added successfully',
    budget_updated: 'Budget updated successfully',
    delete_budget: 'Delete Budget',
    delete_budget_confirm: 'Are you sure you want to delete this budget?',
    edit_budget: 'Edit Budget',

    // Goals
    goals: 'Goals',
    saving_goals: 'Saving Goals',
    target_amount: 'Target Amount',
    target_date: 'Target Date',
    create_goal: 'Create New Goal',
    goal_name: 'Goal Name (e.g. iPhone 16)',
    description_optional: 'Description (Optional)',
    saved: 'Saved',
    remaining: 'Remaining',
    completed: 'Completed',
    done: 'Done!',
    deadline: 'Deadline',
    no_goals: 'No goals yet. Create one!',
    add_funds: 'Add Funds',
    funding_history: 'Funding History',
    goal_details: 'Goal Details',
    congrats_goal: 'Congratulations! Goal completed!',

    // Subs
    subs: 'Subs',
    subscriptions: 'Subscriptions',
    no_subs: 'No subscriptions tracked yet.',
    add_sub: 'Add Subscription',
    edit_sub: 'Edit Subscription',
    cycle: 'Cycle',
    monthly: 'Monthly',
    yearly: 'Yearly',
    next_payment_date: 'Next Payment Date',
    overdue: 'Overdue',
    today: 'Today',
    tomorrow: 'Tomorrow',
    days_left: 'days left',

    // Debts
    debts: 'Debts',
    i_borrowed: 'I Borrowed',
    i_lent: 'I Lent',
    no_debts: 'No records found.',
    new_record: 'New Record',
    edit_record: 'Edit Record',
    person_name: 'Person Name',
    interest_rate: 'Interest Rate % (Optional)',
    date_borrowed_lent: 'Date Borrowed/Lent',
    due_date: 'Due Date',
    paid: 'PAID',
    unpaid: 'UNPAID',
    due: 'Due',
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
    limit_amount: 'Số tiền giới hạn',
    budget_added: 'Thêm ngân sách thành công',
    budget_updated: 'Cập nhật ngân sách thành công',
    delete_budget: 'Xóa ngân sách',
    delete_budget_confirm: 'Bạn có chắc chắn muốn xóa ngân sách này không?',
    edit_budget: 'Sửa ngân sách',

    // Goals
    goals: 'Mục tiêu',
    saving_goals: 'Mục tiêu tiết kiệm',
    target_amount: 'Số tiền mục tiêu',
    target_date: 'Ngày mục tiêu',
    create_goal: 'Tạo mục tiêu mới',
    goal_name: 'Tên mục tiêu (VD: iPhone 16)',
    description_optional: 'Mô tả (Tùy chọn)',
    saved: 'Đã lưu',
    remaining: 'Còn thiếu',
    completed: 'Hoàn thành',
    done: 'Xong!',
    deadline: 'Hạn chót',
    no_goals: 'Chưa có mục tiêu nào. Hãy tạo mới!',
    add_funds: 'Nạp tiền',
    funding_history: 'Lịch sử nạp tiền',
    goal_details: 'Chi tiết mục tiêu',
    congrats_goal: 'Chúc mừng! Đã đạt mục tiêu!',

    // Subs
    subs: 'Hóa đơn',
    subscriptions: 'Hóa đơn định kỳ',
    no_subs: 'Chưa có hóa đơn nào.',
    add_sub: 'Thêm hóa đơn',
    edit_sub: 'Sửa hóa đơn',
    cycle: 'Chu kỳ',
    monthly: 'Hàng tháng',
    yearly: 'Hàng năm',
    next_payment_date: 'Ngày thanh toán tiếp theo',
    overdue: 'Quá hạn',
    today: 'Hôm nay',
    tomorrow: 'Ngày mai',
    days_left: 'ngày nữa',

    // Debts
    debts: 'Khoản nợ',
    i_borrowed: 'Tôi đi vay',
    i_lent: 'Tôi cho vay',
    no_debts: 'Chưa có bản ghi nào.',
    new_record: 'Bản ghi mới',
    edit_record: 'Sửa bản ghi',
    person_name: 'Tên người vay/cho vay',
    interest_rate: 'Lãi suất % (Tùy chọn)',
    date_borrowed_lent: 'Ngày vay/cho vay',
    due_date: 'Hạn trả',
    paid: 'ĐÃ TRẢ',
    unpaid: 'CHƯA TRẢ',
    due: 'Hạn',
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
