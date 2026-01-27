// i18n.js - Multi-language support for Travel Planner

export const translations = {
  'zh-TW': {
    // App title & common
    appTitle: '旅遊規劃大師',
    appSubtitle: '開始規劃您的下一場冒險',
    
    // Navigation
    navItinerary: '行程規劃',
    navBudget: '旅費支出',
    navMap: '地圖',
    
    // Actions
    addTrip: '新增行程',
    addActivity: '新增行程',
    addExpense: '新增支出',
    edit: '編輯',
    delete: '刪除',
    save: '儲存',
    cancel: '取消',
    confirm: '確認',
    close: '關閉',
    
    // Trip form
    createTrip: '建立行程',
    editTrip: '編輯行程',
    destination: '目的地',
    destinationPlaceholder: '例如：東京、京都...',
    startDate: '開始日期',
    endDate: '結束日期',
    participants: '參加者',
    participantPlaceholder: '輸入名稱後按 Enter 新增',
    coverImage: '封面圖片',
    uploadImage: '上傳圖片',
    removeImage: '移除圖片',
    
    // Activity form
    createActivity: '新增行程',
    editActivity: '編輯行程',
    createExpense: '新增支出',
    editExpense: '編輯支出',
    activityName: '行程名稱',
    expenseName: '支出名稱',
    activityNamePlaceholder: '例如：參觀美術館...',
    expenseNamePlaceholder: '例如：午餐、交通費...',
    time: '時間',
    timeOptional: '時間 (選填)',
    date: '日期',
    dateOptional: '日期 (選填)',
    location: '地點 (選填)',
    locationPlaceholder: '地址或地標...',
    amount: '金額 (選填)',
    type: '類型',
    splitBy: '分帳成員 (預設全員)',
    notes: '備註 (選填)',
    notesPlaceholder: '補充資訊...',
    unassigned: '待安排（未指定日期）',
    
    // Categories
    categorySightseeing: '觀光',
    categoryFood: '美食',
    categoryTransport: '交通',
    categoryShopping: '購物',
    categoryOther: '其他',
    
    // Labels
    costLabel: '費用',
    splitLabel: '分帳',
    
    // Dashboard
    noTrips: '還沒有行程',
    noTripsHint: '點擊上方按鈕建立您的第一個旅遊計畫',
    days: '天',
    people: '人',
    
    // Trip detail
    allActivities: '所有行程',
    unassignedActivities: '待安排',
    unassignedHint: '尚未指定日期的行程',
    noActivities: '這天還沒有行程',
    noActivitiesHint: '點擊下方按鈕新增第一個行程',
    
    // Budget
    totalExpense: '目前總花費',
    recordedExpenses: '已記錄行程數',
    items: '筆',
    categoryBreakdown: '分類概況',
    categoryChart: '花費分類',
    expenseList: '支出明細與分帳',
    noExpenses: '尚無支出紀錄',
    splitSummary: '分帳概況',
    noParticipants: '無參加者資料',
    
    // Announcement
    announcement: '公告',
    pinnedAnnouncement: '置頂公告',
    editAnnouncement: '編輯公告',
    deleteAnnouncement: '刪除公告',
    announcementPlaceholder: '輸入公告內容...',
    
    // Confirmations
    deleteConfirmTitle: '確認刪除',
    deleteTripConfirm: '確定要刪除行程',
    deleteTripWarning: '此操作無法復原，所有相關資料將被永久刪除。',
    deleteActivityConfirm: '確定要刪除此項目嗎？',
    
    // Errors
    fillAllFields: '請填寫所有欄位',
    startDateError: '開始日期不能晚於結束日期',
    enterName: '請填寫名稱',
    saveFailed: '儲存失敗，請重試',
    
    // Menu
    menu: '選單',
    tripSettings: '行程設定',
    backToDashboard: '返回首頁',
    viewDetails: '查看詳情',
    deleteTrip: '刪除行程',
    openMenu: '開啟選單',
    
    // Map
    mapLoading: '載入地圖中...',
    mapError: '地圖載入失敗',
    locationList: '地點列表',
    totalLocations: '共 {count} 個地點',
    noLocations: '尚無設定地點的行程',
    noLocationsHint: '在活動中填寫地點即可顯示於地圖',
    openInGoogleMaps: '在 Google Maps 中開啟',
    
    // Edit Trip
    pinnedAnnouncementLabel: '置頂公告 (選填)',
    editPinnedAnnouncement: '編輯置頂公告',
    pinnedAnnouncementPlaceholder: '例如：記得帶護照、集合地點...',
    participantsLabel: '參加者名單',
    participantInputPlaceholder: '輸入名字後按 + (例如：小明)',
    noParticipantsAdded: '尚未新增參加者',
    
    // Activity Types
    typeSightseeing: '觀光',
    typeFood: '美食',
    typeTransport: '交通',
    typeShopping: '購物',
    typeOther: '其他',
    typeGeneral: '行程',

    // UI Labels
    labelDay: '第幾天',
    labelUnscheduled: '未指定日期',
    labelSplitWith: '分攤成員：',
    labelChangeImage: '更換圖片',
    labelRemoveImage: '移除圖片',
    labelProcessing: '處理中...',
    labelUploadCover: '點擊上傳封面圖片',
    labelAutoOptimized: '(自動壓縮最佳化)',
    placeholderAnnouncement: '請輸入公告內容...',
    
    // Buttons
    btnCancel: '取消',
    btnSaveChange: '儲存變更',
    btnCreateTrip: '建立行程',
    btnSaveAnnouncement: '儲存公告',
    
    // Errors
    errorFillAllFields: '請填寫所有欄位',
    errorDateOrder: '開始日期不能晚於結束日期',
    errorSaveFailed: '儲存失敗，請重試',
    errorImageFormat: '請上傳圖片檔案 (JPG, PNG)',
    errorImageProcessing: '圖片處理失敗，請重試',
    errorNameRequired: '請填寫名稱',
    errorAddFailed: '新增失敗，請重試',
    errorUpdateFailed: '更新失敗，請重試',
    
    // Language
    language: '語言',
  },
  
  'ja': {
    // App title & common
    appTitle: '旅行プランナー',
    appSubtitle: '次の冒険を計画しよう',
    
    // Navigation
    navItinerary: '旅程',
    navBudget: '旅費',
    navMap: '地図',
    
    // Actions
    addTrip: '旅行を追加',
    addActivity: '予定を追加',
    addExpense: '支出を追加',
    edit: '編集',
    delete: '削除',
    save: '保存',
    cancel: 'キャンセル',
    confirm: '確認',
    close: '閉じる',
    
    // Trip form
    createTrip: '旅行を作成',
    editTrip: '旅行を編集',
    destination: '目的地',
    destinationPlaceholder: '例：東京、京都...',
    startDate: '開始日',
    endDate: '終了日',
    participants: '参加者',
    participantPlaceholder: '名前を入力してEnterで追加',
    coverImage: 'カバー画像',
    uploadImage: '画像をアップロード',
    removeImage: '画像を削除',
    
    // Activity form
    createActivity: '予定を追加',
    editActivity: '予定を編集',
    createExpense: '支出を追加',
    editExpense: '支出を編集',
    activityName: '予定名',
    expenseName: '支出名',
    activityNamePlaceholder: '例：美術館を訪問...',
    expenseNamePlaceholder: '例：昼食、交通費...',
    time: '時間',
    timeOptional: '時間（任意）',
    date: '日付',
    dateOptional: '日付（任意）',
    location: '場所（任意）',
    locationPlaceholder: '住所またはランドマーク...',
    amount: '金額（任意）',
    type: 'カテゴリー',
    splitBy: '割り勘メンバー（デフォルト: 全員）',
    notes: 'メモ（任意）',
    notesPlaceholder: '補足情報...',
    unassigned: '未定（日付未指定）',
    
    // Categories
    categorySightseeing: '観光',
    categoryFood: '食事',
    categoryTransport: '交通',
    categoryShopping: 'ショッピング',
    categoryOther: 'その他',
    
    // Labels
    costLabel: '費用',
    splitLabel: '割り勘',
    
    // Dashboard
    noTrips: '旅行がありません',
    noTripsHint: '上のボタンをクリックして最初の旅行プランを作成',
    days: '日間',
    people: '人',
    
    // Trip detail
    allActivities: 'すべての予定',
    unassignedActivities: '未定',
    unassignedHint: '日付未指定の予定',
    noActivities: 'この日には予定がありません',
    noActivitiesHint: '下のボタンをクリックして予定を追加',
    
    // Budget
    totalExpense: '現在の合計支出',
    recordedExpenses: '記録された支出',
    items: '件',
    categoryBreakdown: 'カテゴリー別',
    categoryChart: '支出カテゴリー',
    expenseList: '支出明細と割り勘',
    noExpenses: '支出記録がありません',
    splitSummary: '割り勘概要',
    noParticipants: '参加者データがありません',
    
    // Announcement
    announcement: 'お知らせ',
    pinnedAnnouncement: 'ピン留めお知らせ',
    editAnnouncement: 'お知らせを編集',
    deleteAnnouncement: 'お知らせを削除',
    announcementPlaceholder: 'お知らせ内容を入力...',
    
    // Confirmations
    deleteConfirmTitle: '削除の確認',
    deleteTripConfirm: 'この旅行を削除しますか',
    deleteTripWarning: 'この操作は元に戻せません。すべての関連データが永久に削除されます。',
    deleteActivityConfirm: 'このアイテムを削除しますか？',
    
    // Errors
    fillAllFields: 'すべての項目を入力してください',
    startDateError: '開始日は終了日より前でなければなりません',
    enterName: '名前を入力してください',
    saveFailed: '保存に失敗しました。もう一度お試しください',
    
    // Menu
    menu: 'メニュー',
    tripSettings: '旅行設定',
    backToDashboard: 'ホームに戻る',
    viewDetails: '詳細を見る',
    deleteTrip: '旅行を削除',
    openMenu: 'メニューを開く',
    
    // Map
    mapLoading: '地図を読み込み中...',
    mapError: '地図の読み込みに失敗しました',
    locationList: '場所リスト',
    totalLocations: '全 {count} 箇所',
    noLocations: '場所が設定された予定がありません',
    noLocationsHint: '予定に場所を入力すると地図に表示されます',
    openInGoogleMaps: 'Google Maps で開く',
    
    // Edit Trip
    pinnedAnnouncementLabel: 'ピン留めお知らせ（任意）',
    editPinnedAnnouncement: 'お知らせを編集',
    pinnedAnnouncementPlaceholder: '例：パスポートを忘れずに、集合場所...',
    participantsLabel: '参加者リスト',
    participantInputPlaceholder: '名前を入力して + を押す (例: 田中)',
    noParticipantsAdded: '参加者が追加されていません',

    // Activity Types
    typeSightseeing: '観光',
    typeFood: 'グルメ',
    typeTransport: '移動',
    typeShopping: '買い物',
    typeOther: 'その他',
    typeGeneral: '旅程',

    // UI Labels
    labelDay: '日目',
    labelUnscheduled: '日時未定',
    labelSplitWith: '割り勘メンバー：',
    labelChangeImage: '画像を変更',
    labelRemoveImage: '画像を削除',
    labelProcessing: '処理中...',
    labelUploadCover: '表紙画像をアップロード',
    labelAutoOptimized: '(自動最適化)',
    placeholderAnnouncement: 'お知らせを入力...',
    
    // Buttons
    btnCancel: 'キャンセル',
    btnSaveChange: '変更を保存',
    btnCreateTrip: '旅程を作成',
    btnSaveAnnouncement: 'お知らせを保存',
    
    // Errors
    errorFillAllFields: 'すべての項目を入力してください',
    errorDateOrder: '開始日は終了日より前の日付にしてください',
    errorSaveFailed: '保存に失敗しました。やり直してください',
    errorImageFormat: '画像ファイル(JPG, PNG)をアップロードしてください',
    errorImageProcessing: '画像の処理に失敗しました',
    errorNameRequired: '名称を入力してください',
    errorAddFailed: '追加に失敗しました',
    errorUpdateFailed: '更新に失敗しました',
    
    // Language
    language: '言語',
  },
  
  'en': {
    // App title & common
    appTitle: 'Travel Planner',
    appSubtitle: 'Plan your next adventure',
    
    // Navigation
    navItinerary: 'Itinerary',
    navBudget: 'Expenses',
    navMap: 'Map',
    
    // Actions
    addTrip: 'Add Trip',
    addActivity: 'Add Activity',
    addExpense: 'Add Expense',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    
    // Trip form
    createTrip: 'Create Trip',
    editTrip: 'Edit Trip',
    destination: 'Destination',
    destinationPlaceholder: 'e.g., Tokyo, Kyoto...',
    startDate: 'Start Date',
    endDate: 'End Date',
    participants: 'Participants',
    participantPlaceholder: 'Enter name and press Enter',
    coverImage: 'Cover Image',
    uploadImage: 'Upload Image',
    removeImage: 'Remove Image',
    
    // Activity form
    createActivity: 'Add Activity',
    editActivity: 'Edit Activity',
    createExpense: 'Add Expense',
    editExpense: 'Edit Expense',
    activityName: 'Activity Name',
    expenseName: 'Expense Name',
    activityNamePlaceholder: 'e.g., Visit museum...',
    expenseNamePlaceholder: 'e.g., Lunch, Transport...',
    time: 'Time',
    timeOptional: 'Time (Optional)',
    date: 'Date',
    dateOptional: 'Date (Optional)',
    location: 'Location (Optional)',
    locationPlaceholder: 'Address or landmark...',
    amount: 'Amount (Optional)',
    type: 'Category',
    splitBy: 'Split By (Default: All)',
    notes: 'Notes (Optional)',
    notesPlaceholder: 'Additional info...',
    unassigned: 'Unassigned (No date)',
    
    // Categories
    categorySightseeing: 'Sightseeing',
    categoryFood: 'Food',
    categoryTransport: 'Transport',
    categoryShopping: 'Shopping',
    categoryOther: 'Other',
    
    // Labels
    costLabel: 'Cost',
    splitLabel: 'Split',
    
    // Dashboard
    noTrips: 'No trips yet',
    noTripsHint: 'Click the button above to create your first travel plan',
    days: 'days',
    people: 'people',
    
    // Trip detail
    allActivities: 'All Activities',
    unassignedActivities: 'Unassigned',
    unassignedHint: 'Activities without a date',
    noActivities: 'No activities for this day',
    noActivitiesHint: 'Click the button below to add your first activity',
    
    // Budget
    totalExpense: 'Total Expenses',
    recordedExpenses: 'Recorded expenses',
    items: 'items',
    categoryBreakdown: 'Category Breakdown',
    categoryChart: 'Expense Categories',
    expenseList: 'Expense Details & Split',
    noExpenses: 'No expense records',
    splitSummary: 'Split Summary',
    noParticipants: 'No participant data',
    
    // Announcement
    announcement: 'Announcement',
    pinnedAnnouncement: 'Pinned Announcement',
    editAnnouncement: 'Edit Announcement',
    deleteAnnouncement: 'Delete Announcement',
    announcementPlaceholder: 'Enter announcement...',
    
    // Confirmations
    deleteConfirmTitle: 'Confirm Delete',
    deleteTripConfirm: 'Delete this trip',
    deleteTripWarning: 'This action cannot be undone. All related data will be permanently deleted.',
    deleteActivityConfirm: 'Delete this item?',
    
    // Errors
    fillAllFields: 'Please fill in all fields',
    startDateError: 'Start date cannot be after end date',
    enterName: 'Please enter a name',
    saveFailed: 'Save failed, please try again',
    
    // Menu
    menu: 'Menu',
    tripSettings: 'Trip Settings',
    backToDashboard: 'Back to Home',
    viewDetails: 'View Details',
    deleteTrip: 'Delete Trip',
    openMenu: 'Open Menu',
    
    // Map
    mapLoading: 'Loading map...',
    mapError: 'Map load failed',
    locationList: 'Locations',
    totalLocations: '{count} locations',
    noLocations: 'No locations set',
    noLocationsHint: 'Add location to activities to see them on map',
    openInGoogleMaps: 'Open in Google Maps',
    
    // Edit Trip
    pinnedAnnouncementLabel: 'Pinned Announcement (Optional)',
    editPinnedAnnouncement: 'Edit Pinned Announcement',
    pinnedAnnouncementPlaceholder: 'e.g., Remember passport, meeting point...',
    participantsLabel: 'Participants List',
    participantInputPlaceholder: 'Enter name and press + (e.g., John)',
    noParticipantsAdded: 'No participants added yet',

    // Activity Types
    typeSightseeing: 'Sightseeing',
    typeFood: 'Food',
    typeTransport: 'Transport',
    typeShopping: 'Shopping',
    typeOther: 'Other',
    typeGeneral: 'Itinerary',

    // UI Labels
    labelDay: 'Day',
    labelUnscheduled: 'Unscheduled',
    labelSplitWith: 'Split with:',
    labelChangeImage: 'Change image',
    labelRemoveImage: 'Remove image',
    labelProcessing: 'Processing...',
    labelUploadCover: 'Click to upload cover',
    labelAutoOptimized: '(Auto optimized)',
    placeholderAnnouncement: 'Enter announcement...',
    
    // Buttons
    btnCancel: 'Cancel',
    btnSaveChange: 'Save Changes',
    btnCreateTrip: 'Create Trip',
    btnSaveAnnouncement: 'Save Announcement',
    
    // Errors
    errorFillAllFields: 'Please fill in all fields',
    errorDateOrder: 'Start date cannot be later than end date',
    errorSaveFailed: 'Save failed, please try again',
    errorImageFormat: 'Please upload an image file (JPG, PNG)',
    errorImageProcessing: 'Image processing failed, please try again',
    errorNameRequired: 'Please enter a name',
    errorAddFailed: 'Add failed, please try again',
    errorUpdateFailed: 'Update failed, please try again',
    
    // Language
    language: 'Language',
  }
};

// Current language state
let currentLanguage = 'ja';

// Get translation function
export const t = (key, lang) => {
  const targetLang = lang || currentLanguage;
  return translations[targetLang]?.[key] || translations['zh-TW']?.[key] || key;
};

// Set language
export const setLanguage = (lang) => {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
  }
};

// Get current language
export const getLanguage = () => currentLanguage;

// Initialize language from localStorage
export const initLanguage = () => {
  const saved = localStorage.getItem('language');
  if (saved && translations[saved]) {
    currentLanguage = saved;
  }
  return currentLanguage;
};

// Language options
export const languageOptions = [
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' }
];
