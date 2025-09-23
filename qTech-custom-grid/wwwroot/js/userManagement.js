
// Global for mGrid pager input 
window.numbers_only_grid_page = function (e) {
    var ev = e || window.event;
    var key = ev.which != null ? ev.which : ev.keyCode;
    var isNumber = (key >= 48 && key <= 57) || (key >= 96 && key <= 105);
    var isControl = key === 8 || key === 46 || key === 37 || key === 39 || key === 9 || key === 13;
    if (isNumber || isControl) return true;
    if (ev.preventDefault) ev.preventDefault();
    ev.returnValue = false;
    return false;
};
    window.UserManagement = UserManagement;
    window.refreshUsersGrid = function() { UserManagement.refreshGrid(); };
    window.td_MouseOver = td_MouseOver;
    window.td_MouseOut = td_MouseOut;
    window.div_title_MouseOver = div_title_MouseOver;
    window.div_title_MouseOut = div_title_MouseOut;
    window.convertDateBeforeValidation = convertDateBeforeValidation;
    // Main UserManagement module
    var UserManagement = {
        usersGrid: null,
        selectedUserId: null,
        validationArray: null,
        isModalOpen: false,

        // Initialize the module
        init: function() {
            UserManagement.initializeUsersGrid();
            UserManagement.bindActionButtons();
            UserManagement.bindModalEvents();
        },

        // Initialize mGrid for users
        initializeUsersGrid: function() {
            UserManagement.usersGrid = {
                Table: {
                    ID: 'tbl_Users',
                    Header: { Row: {} },
                    Body: { Row: {} }
                },
                Columns: [
                    GridHelper.getGridColumnCheckBoxObj("", "50px", "Id", {
                        check_OnChange: function() {
                            // This will be handled by mSingleCheck
                        }
                    }),
                    GridHelper.getGridColumnObj('IdentityNumber', "رقم الهوية", false, 120, 30, true),
                    GridHelper.getGridColumnObj('FullName', "اسم الموظف", true, 200, 30, true),
                    GridHelper.getGridColumnObj('MobileNumber', "رقم الجوال", false, 120, 30, true),
                    GridHelper.getGridColumnObj('MaritalStatusName', "الحالة الاجتماعية", false, 150, 30, true),
                    GridHelper.getGridColumnObj('NationalityName', "الجنسية", false, 100, 30, true),
                    GridHelper.getGridColumnObj('Email', "البريد الإلكتروني", true, 200, 30, true)
                ],
                Url: '/User/GetUsersForGrid',
                requestType: 'POST',
                pageRowCounts: 10,
                sortColumn: 'FullName',
                sortOrder: 'ASC',
                sortingNotificator: false,
                searchObject: {},
                Pager: {
                    Container: { ID: 'div_Pager' },
                    firstButton: { ID: 'btn_First' },
                    backButton: { ID: 'btn_Back' },
                    nextButton: { ID: 'btn_Next' },
                    lastButton: { ID: 'btn_Last' },
                    currentPageText: { ID: 'txt_CurrentPage' },
                    pagesCountLabel: { ID: 'lbl_PagesCount' },
                    rowsCountLabel: { ID: 'lbl_RowsCount' }
                },
                Empty: {
                    ID: 'div_Empty',
                    Text: 'لا توجد بيانات للعرض'
                },
                Loader: {
                    Container: { ID: 'div_Loader' }
                },
                onGridRowsComplete: function(utility) {
                    // Apply single check with a small delay to ensure DOM is ready
                    setTimeout(function() {
                        UserManagement.selectedUserId = null;
                        UserManagement.updateActionButtons();
                        UserManagement.applySingleCheck();
                    }, 100);
                },

            };

            mGridInitialize(UserManagement.usersGrid);
            UserManagement.applySingleCheck();
        },

        // Update selected user from checkbox
        updateSelectedUser: function() {
            UserManagement.selectedUserId = null;
            var table = document.getElementById('tbl_Users');
            if (!table) return;
            var inputs = table.getElementsByTagName('input');
            for (var i = 0; i < inputs.length; i++) {
                var el = inputs[i];
                if (el && el.type === 'checkbox' && el.name === 'cb_Select' && el.checked) {
                    var checkboxId = el.id || '';
                    if (checkboxId.indexOf('cb_Select_') !== -1) {
                        var userId = parseInt(checkboxId.replace('cb_Select_', ''), 10);
                        if (!isNaN(userId)) {
                            UserManagement.selectedUserId = userId;
                            break;
                        }
                    }
                }
            }
        },

        // Update action buttons state
        updateActionButtons: function() {
            var hasSelection = UserManagement.selectedUserId !== null;
            var viewBtn = document.getElementById('btn_View');
            var deleteBtn = document.getElementById('btn_Delete');
            if (viewBtn) viewBtn.disabled = !hasSelection;
            if (deleteBtn) deleteBtn.disabled = !hasSelection;
        },

        // Apply single check functionality using mSingleCheck.js
        applySingleCheck: function() {
            if (!(window.mScript && typeof mScript.mSingleCheck === 'function')) {
                return;
            }

            // Apply mSingleCheck with proper configuration
                mScript.mSingleCheck({
                    Container: 'tbl_Users',
                    setIds: false, // Don't let mSingleCheck change the IDs
                    OnCheck: function (ctx) {
                        UserManagement.updateSelectedUser();
                        UserManagement.updateActionButtons();
                    },
                    OnUnCheck: function (ctx) {
                        UserManagement.updateSelectedUser();
                        UserManagement.updateActionButtons();
                    }
                });
           
            
        },


        // Bind action buttons
        bindActionButtons: function() {
            var btnSearch = document.getElementById('btn_Search');
            if (btnSearch) btnSearch.addEventListener('click', function(){ UserManagement.performSearch(); });
            var btnClear = document.getElementById('btn_ClearSearch');
            if (btnClear) btnClear.addEventListener('click', function(){ UserManagement.clearSearch(); });
            var txtPhone = document.getElementById('txt_PhoneSearch');
            if (txtPhone) txtPhone.addEventListener('keypress', function(e){ if ((e.which===13) || (e.key==='Enter')) UserManagement.performSearch(); });
            var txtId = document.getElementById('txt_IdSearch');
            if (txtId) txtId.addEventListener('keypress', function(e){ if ((e.which===13) || (e.key==='Enter')) UserManagement.performSearch(); });
            var btnAdd = document.getElementById('btn_Add');
            if (btnAdd) btnAdd.addEventListener('click', function(){ UserManagement.showCreateModal(); });
            var btnView = document.getElementById('btn_View');
            if (btnView) btnView.addEventListener('click', function(){ UserManagement.viewSelectedUser(); });
            var btnDel = document.getElementById('btn_Delete');
            if (btnDel) btnDel.addEventListener('click', function(){ UserManagement.deleteSelectedUsers(); });
        },

        // Search functionality
        performSearch: function() {
            var phoneEl = document.getElementById('txt_PhoneSearch');
            var idEl = document.getElementById('txt_IdSearch');
            var phoneSearch = phoneEl ? (phoneEl.value || '').trim() : '';
            var idSearch = idEl ? (idEl.value || '').trim() : '';
            var searchObject = { 
                phoneSearch: phoneSearch,
                idSearch: idSearch
            };
            UserManagement.usersGrid.searchObject = searchObject;
            
            // Disable view and delete buttons during search
            var v = document.getElementById('btn_View');
            var d = document.getElementById('btn_Delete');
            if (v) v.disabled = true;
            if (d) d.disabled = true;
            UserManagement.selectedUserId = null;
            
            Reload(searchObject, UserManagement.usersGrid);
            
            setTimeout(function() {
                UserManagement.applySingleCheck();
            }, 200);
        },

        // Clear search functionality
        clearSearch: function() {
            var phoneEl = document.getElementById('txt_PhoneSearch');
            if (phoneEl) phoneEl.value = '';
            var idEl = document.getElementById('txt_IdSearch');
            if (idEl) idEl.value = '';
            var emptySearchObject = { phoneSearch: '', idSearch: '' };
            UserManagement.usersGrid.searchObject = emptySearchObject;
            
            // Disable view and delete buttons during clear search
            var v = document.getElementById('btn_View');
            var d = document.getElementById('btn_Delete');
            if (v) v.disabled = true;
            if (d) d.disabled = true;
            UserManagement.selectedUserId = null;
            
            Reload(emptySearchObject, UserManagement.usersGrid);
            
            setTimeout(function() {
                UserManagement.applySingleCheck();
            }, 200);
        },

        // Show create modal
        showCreateModal: function() {
            $.get('/User/Create')
                .done(function(html) {
                    var c = document.getElementById('userModalContainer');
                    if (c) c.innerHTML = html;
                    UserManagement.isModalOpen = true;
                    var modalEl = document.getElementById('createUserModal');
                    if (modalEl && window.bootstrap && bootstrap.Modal) {
                        modalEl.addEventListener('shown.bs.modal', function(){ UserManagement.initializeModalValidation(); }, { once: true });
                        modalEl.addEventListener('hidden.bs.modal', function(){ UserManagement.isModalOpen = false; var cont = document.getElementById('userModalContainer'); if (cont) cont.innerHTML = ''; }, { once: true });
                        var modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                        modal.show();
                    }
                })
                .fail(function() {
                    alert('حدث خطأ أثناء تحميل نموذج الإضافة');
                });
        },

        // View selected user
        viewSelectedUser: function() {
            if (UserManagement.selectedUserId) {
                window.location.href = '/User/Details/' + UserManagement.selectedUserId;
            }
        },

        // Delete selected user
        deleteSelectedUsers: function() {
            if (!UserManagement.selectedUserId) return;
            var title = document.getElementById('confirmationModalLabel');
            var body = document.getElementById('confirmationModalBody');
            if (title) title.textContent = 'تأكيد الحذف';
            if (body) body.textContent = 'هل أنت متأكد من حذف هذا المستخدم؟';
            var confirmBtn = document.getElementById('confirmActionBtn');
            if (confirmBtn) {
                confirmBtn.onclick = function() {
                    var modalEl = document.getElementById('confirmationModal');
                    if (modalEl && window.bootstrap && bootstrap.Modal) {
                        var modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                        modal.hide();
                    }
                    UserManagement.performDelete();
                };
            }
            var modalElShow = document.getElementById('confirmationModal');
            if (modalElShow && window.bootstrap && bootstrap.Modal) {
                var mdl = bootstrap.Modal.getInstance(modalElShow) || new bootstrap.Modal(modalElShow);
                mdl.show();
            }
        },

        // Perform actual delete
        performDelete: function() {
            $.ajax({
                url: '/User/Delete',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ id: UserManagement.selectedUserId }),
                success: function(response) {
                    if (response.success) {
                        alert(response.message);
                        Reload(UserManagement.usersGrid.searchObject, UserManagement.usersGrid);
                        UserManagement.selectedUserId = null;
                        UserManagement.updateActionButtons();
                    } else {
                        alert(response.message);
                    }
                },
                error: function(xhr, status, error) {
                    alert('حدث خطأ أثناء الحذف: ' + xhr.status + ' - ' + error);
                }
            });
        },

        // Refresh grid after operations
        refreshGrid: function() {
            Reload(UserManagement.usersGrid.searchObject, UserManagement.usersGrid);
            UserManagement.selectedUserId = null;
            UserManagement.updateActionButtons();
            
            setTimeout(function() {
                UserManagement.applySingleCheck();
            }, 200);
        },

        // Bind modal events
        bindModalEvents: function() {
            // No global jQuery bindings; handled in showCreateModal per instance
        },

        // Initialize modal validation
        initializeModalValidation: function() {
            UserManagement.initializeValidationArray();
            UserManagement.bindModalButtons();
            UserManagement.initializeAsterisks();
        },

        // Initialize validation array
        initializeValidationArray: function() {
            UserManagement.validationArray = [
                // First Name - Required field with character validation
                {
                    Element: 'txt_FirstName',
                    spn_A: 'spnA_FirstName',
                    spn_E: 'spnE_FirstName',
                    validationScheme: {
                        Required: {
                            Msg: 'برجاء ادخال الاسم الأول'
                        },
                        Length: {
                            maxLength: {
                                Value: 15,
                                Msg: 'الاسم الأول لا يجب أن يتجاوز 15 حرف'
                            },
                            minLength: {
                                Value: 2,
                                Msg: 'الاسم الأول يجب أن يكون على الأقل حرفين'
                            }
                        },
                        Format: {
                            Key: 'charactersOnly',
                            Msg: 'الاسم الأول يجب أن يحتوي على حروف فقط'
                        }
                    },
                    isBlur: true
                },
                // Father Name - Required field with character validation
                {
                    Element: 'txt_FatherName',
                    spn_A: 'spnA_FatherName',
                    spn_E: 'spnE_FatherName',
                    validationScheme: {
                        Required: {
                            Msg: 'برجاء ادخال اسم الأب'
                        },
                        Length: {
                            maxLength: {
                                Value: 15,
                                Msg: 'اسم الأب لا يجب أن يتجاوز 15 حرف'
                            },
                            minLength: {
                                Value: 2,
                                Msg: 'اسم الأب يجب أن يكون على الأقل حرفين'
                            }
                        },
                        Format: {
                            Key: 'charactersOnly',
                            Msg: 'اسم الأب يجب أن يحتوي على حروف فقط'
                        }
                    },
                    isBlur: true
                },
                // Grand Father Name
                {
                    Element: 'txt_GrandFatherName',
                    spn_A: 'spnA_GrandFatherName',
                    spn_E: 'spnE_GrandFatherName',
                    validationScheme: {
                        Required: {
                            Msg: 'برجاء ادخال اسم الجد'
                        },
                        Length: {
                            maxLength: {
                                Value: 15,
                                Msg: 'اسم الجد لا يجب أن يتجاوز 15 حرف'
                            }
                        }
                    },
                    isBlur: true
                },
                // Family Name
                {
                    Element: 'txt_FamilyName',
                    spn_A: 'spnA_FamilyName',
                    spn_E: 'spnE_FamilyName',
                    validationScheme: {
                        Required: {
                            Msg: 'برجاء ادخال لقب العائلة'
                        },
                        Length: {
                            maxLength: {
                                Value: 15,
                                Msg: 'لقب العائلة لا يجب أن يتجاوز 15 حرف'
                            }
                        }
                    },
                    isBlur: true
                },
                // Date of Birth validation using mValidation.js anyDate scheme
                {
                    Element: 'txt_DateOfBirth',
                    spn_A: 'spnA_DateOfBirth',
                    spn_E: 'spnE_DateOfBirth',
                    isBlur: true,
                    validationScheme: {
                        anyDate: {
                            isRequired: true,
                            requiredMessage: "برجاء إدخال تاريخ الميلاد",
                            invalidMessage: "تاريخ الميلاد غير صحيح",
                            minDefaultDate: function() {
                                var today = new Date();
                                var sixtyFiveYearsAgo = new Date(today.getFullYear() - 65, today.getMonth(), today.getDate());
                                return sixtyFiveYearsAgo.getFullYear() + '/' +
                                       (sixtyFiveYearsAgo.getMonth() + 1).toString().padStart(2, '0') + '/' +
                                       sixtyFiveYearsAgo.getDate().toString().padStart(2, '0');
                            },
                            maxDefaultDate: function() {
                                var today = new Date();
                                var eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
                                return eighteenYearsAgo.getFullYear() + '/' +
                                       (eighteenYearsAgo.getMonth() + 1).toString().padStart(2, '0') + '/' +
                                       eighteenYearsAgo.getDate().toString().padStart(2, '0');
                            },
                            maxDate: function() {
                                var today = new Date();
                                var eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
                                return eighteenYearsAgo.getFullYear() + '/' +
                                       (eighteenYearsAgo.getMonth() + 1).toString().padStart(2, '0') + '/' +
                                       eighteenYearsAgo.getDate().toString().padStart(2, '0');
                            },
                            maxRangeMessage: "يجب أن يكون عمر الموظف 18 سنة على الأقل",
                            minDate: function() {
                                var today = new Date();
                                var sixtyFiveYearsAgo = new Date(today.getFullYear() - 65, today.getMonth(), today.getDate());
                                return sixtyFiveYearsAgo.getFullYear() + '/' +
                                       (sixtyFiveYearsAgo.getMonth() + 1).toString().padStart(2, '0') + '/' +
                                       sixtyFiveYearsAgo.getDate().toString().padStart(2, '0');
                            },
                            minRangeMessage: "يجب أن يكون عمر الموظف لا يتجاوز 65 سنة",
                            isGeorg: true
                        },
                        onSuccess: function() {
                            // Validate hiring date when birth date changes
                            if (typeof validateSpecificElement === 'function') {
                                setTimeout(function() {
                                    validateSpecificElement('txt_DateOfAppointment');
                                }, 100);
                            }
                        }
                    }
                },
                // Identity Number validation
                {
                    Element: 'txt_IdentityNumber',
                    spn_A: 'spnA_IdentityNumber',
                    spn_E: 'spnE_IdentityNumber',
                    validationScheme: {
                        Required: {
                            Msg: 'برجاء إدخال رقم الهوية'
                        },
                        Length: {
                            maxLength: {
                                Value: 10,
                                Msg: 'رقم الهوية لا يجب أن يتجاوز 10 أرقام'
                            }
                        },
                        Format: {
                            Key: 'int',
                            Msg: 'رقم الهوية يجب أن يحتوي على أرقام فقط'
                        },
                        checkExist: {
                            Url: '/User/CheckIdentityExists',
                            Data: function() {
                                var el = document.getElementById('txt_IdentityNumber');
                                var val = el ? el.value : '';
                                return JSON.stringify({ identityNumber: val });
                            },
                            successValue: false,
                            Msg: 'عفوا رقم الهوية مكرر'
                        }
                    },
                    isBlur: true
                },
                // Mobile Number validation
                {
                    Element: 'txt_MobileNumber',
                    spn_A: 'spnA_MobileNumber',
                    spn_E: 'spnE_MobileNumber',
                    validationScheme: {
                        Required: {
                            Msg: 'برجاء ادخال رقم الجوال'
                        },
                        Length: {
                            maxLength: {
                                Value: 12,
                                Msg: 'رقم الجوال لا يجب أن يتجاوز 12 رقم'
                            }
                        },
                        Pattern: {
                            Value: 'MOBILE',
                            Msg: 'عفوا رقم الجوال لابد ان يبدأ بـ 9665'
                        }
                    },
                    isBlur: true
                },
                // Email validation
                {
                    Element: 'txt_Email',
                    spn_A: 'spnA_Email',
                    spn_E: 'spnE_Email',
                    validationScheme: {
                        Pattern: {
                            Value: 'EMAIL',
                            Msg: 'عفوا صيغة البريد الالكتروني غير صحيح'
                        },
                        Length: {
                            maxLength: {
                                Value: 50,
                                Msg: 'البريد الإلكتروني لا يجب أن يتجاوز 50 حرف'
                            }
                        }
                    },
                    isBlur: true
                },
                // Bank Account Number validation
                {
                    Element: 'txt_BankAccountNumber',
                    spn_A: 'spnA_BankAccountNumber',
                    spn_E: 'spnE_BankAccountNumber',
                    validationScheme: {
                        Required: {
                            Msg: 'برجاء ادخال رقم الحساب البنكي'
                        },
                        Length: {
                            maxLength: {
                                Value: 30,
                                Msg: 'رقم الحساب البنكي لا يجب أن يتجاوز 30 حرف'
                            }
                        }
                    },
                    isBlur: true
                },
                // Nationality validation
                {
                    Element: 'ddl_Nationality',
                    spn_A: 'spnA_Nationality',
                    spn_E: 'spnE_Nationality',
                    validationScheme: {
                        Required: {
                            Value: '',
                            Msg: 'برجاء اختيار الجنسية'
                        }
                    },
                    isChange: true
                },
                // Date of Appointment validation using mValidation.js anyDate scheme
                {
                    Element: 'txt_DateOfAppointment',
                    spn_A: 'spnA_DateOfAppointment',
                    spn_E: 'spnE_DateOfAppointment',
                    isBlur: true,
                    validationScheme: {
                        anyDate: {
                            isRequired: true,
                            requiredMessage: "برجاء إدخال تاريخ التعيين",
                            invalidMessage: "تاريخ التعيين غير صحيح",
                            minDate: function() {
                                var birthDateElement = document.getElementById('txt_DateOfBirth');
                                var birthDateValue = birthDateElement ? birthDateElement.value : null;
                                
                                if (!birthDateValue) {
                                    return "1980/01/01";
                                }
                                
                                // birthDateValue is already in YYYY/MM/DD format
                                var birthDate = new Date(birthDateValue.replace(/\//g, '-'));
                                
                                var minHiringDate = new Date(birthDate.getFullYear() + 18, birthDate.getMonth(), birthDate.getDate());
                                var result = minHiringDate.getFullYear() + '/' + 
                                       (minHiringDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
                                       minHiringDate.getDate().toString().padStart(2, '0');
                                return result;
                            },
                            minRangeMessage: "تاريخ التعيين يجب أن يكون بعد إتمام 18 سنة من تاريخ الميلاد",
                            maxDate: function() {
                                // Get today's date in YYYY/MM/DD format
                                var today = new Date();
                                var todayStr = today.getFullYear() + '/' + 
                                       (today.getMonth() + 1).toString().padStart(2, '0') + '/' +
                                       today.getDate().toString().padStart(2, '0');
                                return todayStr;
                            },
                            maxRangeMessage: "لا يمكن ان يكون تاريخ التعيين بعد تاريخ اليوم",
                            isGeorg: true
                        }
                    }
                }
            ];
        },

        // Initialize asterisks as BLACK first
        initializeAsterisks: function() {
            UserManagement.validationArray.forEach(function(item) {
                if (item.validationScheme && item.validationScheme.Required) {
                    var asteriskElement = document.getElementById(item.spn_A);
                    if (asteriskElement) {
                        asteriskElement.style.color = 'black'; 
                    }
                }
            });
        },

        // Bind modal buttons
        bindModalButtons: function() {
            // Add validation events using mValidation.js
            AddValidationEvents(UserManagement.validationArray);

            // Calculate leave balance when appointment date changes
            var appt = document.getElementById('txt_DateOfAppointment');
            if (appt) {
                appt.addEventListener('change', function() { UserManagement.calculateLeaveBalance(); });
            }

            // Save button click
            var saveBtn = document.getElementById('btn_SaveUser');
            if (saveBtn) {
                saveBtn.addEventListener('click', function() {
                    var validationResult = validateAll(UserManagement.validationArray, 1);
                    if (validationResult) {
                        UserManagement.saveUser();
                    } else {
                        alert('برجاء تصحيح الأخطاء في النموذج أولاً');
                    }
                });
            }

            // Clear validation button
            var clrBtn = document.getElementById('btn_ClearValidation');
            if (clrBtn) {
                clrBtn.addEventListener('click', function() { clearValidation(UserManagement.validationArray); });
            }

            // Reset form button
            var rstBtn = document.getElementById('btn_ResetForm');
            if (rstBtn) {
                rstBtn.addEventListener('click', function() {
                    var formEl = document.getElementById('createUserForm');
                    if (formEl) formEl.reset();
                    clearValidation(UserManagement.validationArray);
                    var lbl = document.getElementById('lbl_LeaveBalance');
                    if (lbl) lbl.textContent = '0 يوم';
                    var male = document.getElementById('radio_Male');
                    if (male) male.checked = true;
                });
            }
        },

        // Calculate leave balance
        calculateLeaveBalance: function() {
            var appt = document.getElementById('txt_DateOfAppointment');
            var appointmentDate = appt ? appt.value : '';
            if (appointmentDate) {
                var appointment = new Date(appointmentDate);
                var today = new Date();
                
                var yearsDiff = today.getFullYear() - appointment.getFullYear();
                var monthsDiff = today.getMonth() - appointment.getMonth();
                var daysDiff = today.getDate() - appointment.getDate();
                
                // Adjust for partial months
                if (daysDiff < 0) {
                    monthsDiff--;
                }
                if (monthsDiff < 0) {
                    yearsDiff--;
                    monthsDiff += 12;
                }
                
                var totalMonths = yearsDiff * 12 + monthsDiff;
                var leaveBalance = Math.floor((totalMonths / 12) * 21);
                var lbl = document.getElementById('lbl_LeaveBalance');
                if (lbl) lbl.textContent = leaveBalance + ' يوم';
            } else {
                var lbl0 = document.getElementById('lbl_LeaveBalance');
                if (lbl0) lbl0.textContent = '0 يوم';
            }
        },

        // Save user function
        saveUser: function() {
            var formEl = document.getElementById('createUserForm');
            var formData = new FormData(formEl);
            
            $.ajax({
                url: '/User/Create',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.success) {
                        var modalEl = document.getElementById('createUserModal');
                        if (modalEl && window.bootstrap && bootstrap.Modal) {
                            var modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                            modal.hide();
                        }
                        alert(response.message);
                        UserManagement.refreshGrid();
                    } else {
                        alert(response.message);
                    }
                },
                error: function(xhr, status, error) {
                    try {
                        var errorResponse = JSON.parse(xhr.responseText);
                        alert('حدث خطأ أثناء حفظ البيانات: ' + (errorResponse.message || error));
                    } catch (e) {
                        alert('حدث خطأ أثناء حفظ البيانات: ' + xhr.status + ' - ' + error);
                    }
                }
            });
        }
    };

    // Tooltip functions for mGrid compatibility
    function td_MouseOver(event, customFunction) {
        var tooltip = document.getElementById("div_title");
        if (tooltip) {
            var element = event.target || event.srcElement;
            if (element && element.getAttribute('full_title')) {
                tooltip.innerHTML = element.getAttribute('full_title');
                tooltip.style.display = 'block';
                tooltip.style.left = (event.pageX + 10) + 'px';
                tooltip.style.top = (event.pageY + 10) + 'px';
            }
            if (customFunction && typeof customFunction === 'string') {
                eval(customFunction);
            }
        }
    }

    function td_MouseOut(event) {
        var tooltip = document.getElementById("div_title");
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    function div_title_MouseOver(element) {
        element.style.display = 'block';
    }

    function div_title_MouseOut(element) {
        element.style.display = 'none';
    }

    // Simple function to convert date format before validation
    function convertDateBeforeValidation(input) {
        var value = input.value;
        if (value.includes('/')) {
            var parts = value.split('/');
            
            // Add leading zeros if needed
            if (parts.length >= 2 && parts[1].length === 1) {
                parts[1] = parts[1].padStart(2, '0');
            }
            if (parts.length >= 3 && parts[2].length === 1) {
                parts[2] = parts[2].padStart(2, '0');
            }
            
            var convertedValue = parts.join('/');
            input.value = convertedValue;
        }
    }


    // Initialize when document is ready
    $(document).ready(function() {
        UserManagement.init();
    });




