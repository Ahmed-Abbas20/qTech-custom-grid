/**
 * User Management Module
 * Consolidated JavaScript for user grid and create modal functionality
 * No global variables - everything encapsulated in UserManagement module
 */
(function() {
    'use strict';

    // Main UserManagement module
    var UserManagement = {
        // Private variables
        usersGrid: null,
        selectedUserId: null,
        validationArray: null,
        isModalOpen: false,

        // Initialize the module
        init: function() {
            this.initializeUsersGrid();
            this.bindActionButtons();
            this.bindModalEvents();
        },

        // Initialize mGrid for users
        initializeUsersGrid: function() {
            var self = this;
            
            this.usersGrid = {
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
                onGridComplete: function(utility) {
                    // Apply single check with a small delay to ensure DOM is ready
                    setTimeout(function() {
                        self.applySingleCheck();
                    }, 100);
                },
                onRowComplete: function(row) {
                    // Reapply single check for each row completion
                    setTimeout(function() {
                        self.applySingleCheck();
                    }, 50);
                }
            };

            mGridInitialize(this.usersGrid);
            this.applySingleCheck();
        },

        // Update selected user from checkbox
        updateSelectedUser: function() {
            this.selectedUserId = null;
            var self = this;
            
            $('input[name="cb_Select"]:checked').each(function() {
                var $checkbox = $(this);
                var checkboxId = $checkbox.attr('id');
                
                if (checkboxId && checkboxId.indexOf('cb_Select_') !== -1) {
                    var userId = parseInt(checkboxId.replace('cb_Select_', ''));
                    if (!isNaN(userId)) {
                        self.selectedUserId = userId;
                    }
                }
            });
        },

        // Update action buttons state
        updateActionButtons: function() {
            var hasSelection = this.selectedUserId !== null;
            
            var $viewBtn = $('#btn_View');
            var $deleteBtn = $('#btn_Delete');
            
            if (hasSelection) {
                $viewBtn.prop('disabled', false).removeAttr('disabled');
                $deleteBtn.prop('disabled', false).removeAttr('disabled');
            } else {
                $viewBtn.prop('disabled', true).attr('disabled', 'disabled');
                $deleteBtn.prop('disabled', true).attr('disabled', 'disabled');
            }
        },

        // Apply single check functionality using mSingleCheck.js
        applySingleCheck: function() {
            if (!(window.mScript && typeof mScript.mSingleCheck === 'function')) {
                return;
            }
            
            var self = this;
            
            // Clear any existing handlers first
            try {
                var container = mScript.getByIds('tbl_Users');
                if (container && typeof container.getByTypes === 'function') {
                    var group = container.getByTypes(['checkbox']);
                    if (group && group.Elements) {
                        for (var i = 0; i < group.Elements.length; i++) {
                            group.Elements[i].onclick = null;
                            group.Elements[i].onchange = null;
                            group.Elements[i].removeAttribute('checkedFlag');
                            // Don't uncheck checkboxes - let mSingleCheck handle the state
                        }
                    }
                }
            } catch (e) { 
                // Silent error handling
            }

            // Apply mSingleCheck with proper configuration
            try {
                mScript.mSingleCheck({
                    Container: 'tbl_Users',
                    setIds: false, // Don't let mSingleCheck change the IDs
                    OnCheck: function (ctx) {
                        self.updateSelectedUser();
                        self.updateActionButtons();
                    },
                    OnUnCheck: function (ctx) {
                        self.updateSelectedUser();
                        self.updateActionButtons();
                    }
                });
            } catch (e) {
                // Silent error handling
            }
            
            // Manual fallback - bind change events directly to checkboxes
            setTimeout(function() {
                $('input[name="cb_Select"]').off('change.manual').on('change.manual', function() {
                    if (this.checked) {
                        // Uncheck all other checkboxes
                        $('input[name="cb_Select"]').not(this).prop('checked', false);
                    }
                    self.updateSelectedUser();
                    self.updateActionButtons();
                });
            }, 200);
        },


        // Bind action buttons
        bindActionButtons: function() {
            var self = this;
            
            $('#btn_Search').on('click', function() { self.performSearch(); });
            $('#btn_ClearSearch').on('click', function() { self.clearSearch(); });
            $('#txt_PhoneSearch, #txt_IdSearch').on('keypress', function(e) {
                if (e.which === 13) self.performSearch();
            });
            $('#btn_Add').on('click', function() { self.showCreateModal(); });
            $('#btn_View').on('click', function() { self.viewSelectedUser(); });
            $('#btn_Delete').on('click', function() { self.deleteSelectedUsers(); });
        },

        // Search functionality
        performSearch: function() {
            var phoneSearch = $('#txt_PhoneSearch').val().trim();
            var idSearch = $('#txt_IdSearch').val().trim();
            var searchObject = { 
                phoneSearch: phoneSearch,
                idSearch: idSearch
            };
            this.usersGrid.searchObject = searchObject;
            Reload(searchObject, this.usersGrid);
            
            var self = this;
            setTimeout(function() {
                self.applySingleCheck();
            }, 200);
        },

        // Clear search functionality
        clearSearch: function() {
            $('#txt_PhoneSearch').val('');
            $('#txt_IdSearch').val('');
            var emptySearchObject = { phoneSearch: '', idSearch: '' };
            this.usersGrid.searchObject = emptySearchObject;
            Reload(emptySearchObject, this.usersGrid);
            
            var self = this;
            setTimeout(function() {
                self.applySingleCheck();
            }, 200);
        },

        // Show create modal
        showCreateModal: function() {
            var self = this;
            $.get('/User/Create')
                .done(function(html) {
                    $('#userModalContainer').html(html);
                    self.isModalOpen = true;
                })
                .fail(function() {
                    alert('حدث خطأ أثناء تحميل نموذج الإضافة');
                });
        },

        // View selected user
        viewSelectedUser: function() {
            if (this.selectedUserId) {
                window.location.href = '/User/Details/' + this.selectedUserId;
            }
        },

        // Delete selected user
        deleteSelectedUsers: function() {
            if (!this.selectedUserId) return;
            
            var self = this;
            $('#confirmationModalLabel').text('تأكيد الحذف');
            $('#confirmationModalBody').text('هل أنت متأكد من حذف هذا المستخدم؟');
            $('#confirmActionBtn').off('click').on('click', function() {
                $('#confirmationModal').modal('hide');
                self.performDelete();
            });
            $('#confirmationModal').modal('show');
        },

        // Perform actual delete
        performDelete: function() {
            var self = this;
            
            $.ajax({
                url: '/User/Delete',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ id: this.selectedUserId }),
                success: function(response) {
                    if (response.success) {
                        alert(response.message);
                        Reload(self.usersGrid.searchObject, self.usersGrid);
                        self.selectedUserId = null;
                        self.updateActionButtons();
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
            Reload(this.usersGrid.searchObject, this.usersGrid);
            this.selectedUserId = null;
            this.updateActionButtons();
            
            var self = this;
            setTimeout(function() {
                self.applySingleCheck();
            }, 200);
        },

        // Bind modal events
        bindModalEvents: function() {
            var self = this;
            
            // Listen for modal events
            $(document).on('shown.bs.modal', '#createUserModal', function() {
                self.initializeModalValidation();
            });
            
            $(document).on('hidden.bs.modal', '#createUserModal', function() {
                self.isModalOpen = false;
                // Clean up modal content
                $('#userModalContainer').empty();
            });
        },

        // Initialize modal validation
        initializeModalValidation: function() {
            this.initializeValidationArray();
            this.bindModalButtons();
            this.initializeAsterisks();
        },

        // Initialize validation array
        initializeValidationArray: function() {
            this.validationArray = [
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
                            maxDate: function() {
                                var today = new Date();
                                var eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
                                return eighteenYearsAgo.getFullYear() + '/' +
                                       (eighteenYearsAgo.getMonth() + 1).toString().padStart(2, '0') + '/' +
                                       eighteenYearsAgo.getDate().toString().padStart(2, '0');
                            },
                            maxRangeMessage: "يجب أن يكون عمر الموظف 18 سنة على الأقل",
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
                                return JSON.stringify({ identityNumber: $('#txt_IdentityNumber').val() });
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
            this.validationArray.forEach(function(item) {
                if (item.validationScheme && item.validationScheme.Required) {
                    var asteriskElement = document.getElementById(item.spn_A);
                    if (asteriskElement) {
                        asteriskElement.style.color = 'black'; // Start with black, turn red on validation failure
                    }
                }
            });
        },

        // Bind modal buttons
        bindModalButtons: function() {
            var self = this;
            
            // Add validation events using mValidation.js
            AddValidationEvents(this.validationArray);

            // Calculate leave balance when appointment date changes
            $('#txt_DateOfAppointment').on('change', function() {
                self.calculateLeaveBalance();
            });

            // Save button click
            $('#btn_SaveUser').on('click', function() {
                // Run validation using mValidation.js
                var validationResult = validateAll(self.validationArray, 1);
                
                if (validationResult) {
                    self.saveUser();
                } else {
                    alert('برجاء تصحيح الأخطاء في النموذج أولاً');
                }
            });

            // Clear validation button
            $('#btn_ClearValidation').on('click', function() {
                clearValidation(self.validationArray);
            });

            // Reset form button
            $('#btn_ResetForm').on('click', function() {
                // Clear all form fields
                $('#createUserForm')[0].reset();
                // Clear validation
                clearValidation(self.validationArray);
                // Reset leave balance
                $('#lbl_LeaveBalance').text('0 يوم');
                // Reset default values
                $('#radio_Male').prop('checked', true);
            });
        },

        // Calculate leave balance
        calculateLeaveBalance: function() {
            var appointmentDate = $('#txt_DateOfAppointment').val();
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
                
                $('#lbl_LeaveBalance').text(leaveBalance + ' يوم');
            } else {
                $('#lbl_LeaveBalance').text('0 يوم');
            }
        },

        // Save user function
        saveUser: function() {
            var self = this;
            var formData = new FormData($('#createUserForm')[0]);
            
            $.ajax({
                url: '/User/Create',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.success) {
                        $('#createUserModal').modal('hide');
                        alert(response.message);
                        self.refreshGrid();
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

    // Expose only necessary functions globally for compatibility
    window.UserManagement = UserManagement;
    window.refreshUsersGrid = function() { UserManagement.refreshGrid(); };
    window.td_MouseOver = td_MouseOver;
    window.td_MouseOut = td_MouseOut;
    window.div_title_MouseOver = div_title_MouseOver;
    window.div_title_MouseOut = div_title_MouseOut;
    window.convertDateBeforeValidation = convertDateBeforeValidation;

})();
