/**
 * mGrid Single Check Extension
 * Professional solution to ensure mSingleCheck works with mGrid pagination
 * Author: Custom Extension for qTech Project
 * 
 * This extension automatically re-applies mSingleCheck after mGrid operations
 * without modifying the main grid configuration.
 */

(function() {
    'use strict';
    
    // Store original mGrid functions to extend them
    var originalMGridInitialize = window.mGridInitialize;
    var singleCheckConfig = null;
    var isInitialized = false;
    
    /**
     * Enhanced mGrid initialization with single check support
     */
    window.mGridInitialize = function(gridConfig) {
        console.log('🔧 mGrid-SingleCheck Extension: Initializing enhanced grid...');
        
        // Store single check configuration if provided
        if (gridConfig.singleCheckConfig) {
            singleCheckConfig = gridConfig.singleCheckConfig;
            console.log('✅ Single check configuration stored:', singleCheckConfig);
        }
        
        // Store original onGridComplete callback
        var originalOnGridComplete = gridConfig.onGridComplete;
        
        // Enhance onGridComplete to include single check re-application
        gridConfig.onGridComplete = function(utility) {
            console.log('🔄 mGrid-SingleCheck Extension: Grid completed, applying single check...');
            
            // Call original callback first
            if (originalOnGridComplete && typeof originalOnGridComplete === 'function') {
                originalOnGridComplete.call(this, utility);
            }
            
            // Apply single check with multiple attempts for reliability
            applySingleCheckWithRetry();
        };
        
        // Call original mGrid initialization
        if (originalMGridInitialize && typeof originalMGridInitialize === 'function') {
            isInitialized = true;
            return originalMGridInitialize.call(this, gridConfig);
        }
    };
    
    /**
     * Apply mSingleCheck with retry mechanism
     */
    function applySingleCheckWithRetry() {
        if (!singleCheckConfig) {
            console.warn('⚠️ mGrid-SingleCheck Extension: No single check configuration found');
            return;
        }
        
        var maxAttempts = 3;
        var delays = [100, 300, 500]; // Progressive delays
        
        for (var attempt = 0; attempt < maxAttempts; attempt++) {
            setTimeout(function(attemptNum) {
                return function() {
                    console.log('🔄 Attempt ' + (attemptNum + 1) + ': Applying mSingleCheck...');
                    
                    // Check if checkboxes exist
                    var checkboxes = document.querySelectorAll('input[name="' + singleCheckConfig.Name + '"]');
                    if (checkboxes.length === 0) {
                        console.log('⚠️ No checkboxes found on attempt ' + (attemptNum + 1));
                        return;
                    }
                    
                    // Clear existing handlers to prevent conflicts
                    for (var i = 0; i < checkboxes.length; i++) {
                        checkboxes[i].onclick = null;
                        checkboxes[i].removeAttribute('checkedFlag');
                        checkboxes[i].checked = false; // Reset state
                    }
                    
                    // Apply mSingleCheck
                    if (window.mScript && window.mScript.mSingleCheck) {
                        try {
                            mScript.mSingleCheck(singleCheckConfig);
                            console.log('✅ mSingleCheck applied successfully on attempt ' + (attemptNum + 1));
                            
                            // Verify application
                            setTimeout(function() {
                                var verifyBoxes = document.querySelectorAll('input[name="' + singleCheckConfig.Name + '"]');
                                var handlersCount = 0;
                                for (var j = 0; j < verifyBoxes.length; j++) {
                                    if (verifyBoxes[j].onclick) handlersCount++;
                                }
                                console.log('✅ Verification: ' + handlersCount + '/' + verifyBoxes.length + ' checkboxes have handlers');
                            }, 50);
                            
                        } catch (error) {
                            console.error('❌ Error applying mSingleCheck on attempt ' + (attemptNum + 1) + ':', error);
                        }
                    } else {
                        console.error('❌ mScript.mSingleCheck not available');
                    }
                };
            }(attempt), delays[attempt]);
        }
    }
    
    /**
     * Public method to configure single check behavior
     */
    window.configureSingleCheck = function(config) {
        singleCheckConfig = config;
        console.log('✅ Single check configuration updated:', config);
        
        // If grid is already initialized, apply immediately
        if (isInitialized) {
            applySingleCheckWithRetry();
        }
    };
    
    /**
     * Public method to manually re-apply single check
     */
    window.reapplySingleCheck = function() {
        console.log('🔧 Manual re-application of single check requested');
        applySingleCheckWithRetry();
    };
    
    console.log('✅ mGrid-SingleCheck Extension loaded successfully');
    
})();


