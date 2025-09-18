/**
 * mSingleCheck Auto-Monitor
 * Lightweight solution that automatically monitors and maintains single check behavior
 * Author: Custom Extension for qTech Project
 * 
 * This script runs in the background and ensures mSingleCheck is always active
 * regardless of what other scripts do to the checkboxes.
 */

(function() {
    'use strict';
    
    var monitorConfig = {
        checkboxName: 'cb_Select',
        monitorInterval: 1000, // Check every 1 second
        singleCheckConfig: null,
        isMonitoring: false,
        lastCheckboxCount: 0
    };
    
    /**
     * Initialize the auto-monitor
     */
    function initAutoMonitor(config) {
        console.log('🛡️ mSingleCheck Auto-Monitor: Initializing...');
        
        // Update configuration
        if (config) {
            Object.assign(monitorConfig, config);
        }
        
        // Start monitoring
        if (!monitorConfig.isMonitoring) {
            startMonitoring();
        }
    }
    
    /**
     * Start the monitoring process
     */
    function startMonitoring() {
        monitorConfig.isMonitoring = true;
        console.log('🛡️ Auto-Monitor: Started monitoring for checkbox changes...');
        
        setInterval(function() {
            checkAndMaintainSingleCheck();
        }, monitorConfig.monitorInterval);
    }
    
    /**
     * Check if mSingleCheck needs to be reapplied
     */
    function checkAndMaintainSingleCheck() {
        var checkboxes = document.querySelectorAll('input[name="' + monitorConfig.checkboxName + '"]');
        
        // Skip if no checkboxes found
        if (checkboxes.length === 0) {
            return;
        }
        
        // Check if checkbox count changed (indicates grid refresh)
        if (checkboxes.length !== monitorConfig.lastCheckboxCount) {
            console.log('🔄 Auto-Monitor: Checkbox count changed (' + monitorConfig.lastCheckboxCount + ' → ' + checkboxes.length + ')');
            monitorConfig.lastCheckboxCount = checkboxes.length;
            reapplyMSingleCheck();
            return;
        }
        
        // Check if handlers are missing
        var handlersCount = 0;
        var checkedCount = 0;
        
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].onclick) handlersCount++;
            if (checkboxes[i].checked) checkedCount++;
        }
        
        // If no handlers detected, reapply mSingleCheck
        if (handlersCount === 0) {
            console.log('🚨 Auto-Monitor: No onclick handlers detected! Reapplying mSingleCheck...');
            reapplyMSingleCheck();
            return;
        }
        
        // If multiple checkboxes are checked, fix it
        if (checkedCount > 1) {
            console.log('🚨 Auto-Monitor: Multiple checkboxes checked (' + checkedCount + ')! Fixing...');
            fixMultipleSelection(checkboxes);
        }
    }
    
    /**
     * Reapply mSingleCheck configuration
     */
    function reapplyMSingleCheck() {
        if (!monitorConfig.singleCheckConfig) {
            console.warn('⚠️ Auto-Monitor: No mSingleCheck configuration available');
            return;
        }
        
        if (window.mScript && window.mScript.mSingleCheck) {
            try {
                // Clear existing handlers first
                var checkboxes = document.querySelectorAll('input[name="' + monitorConfig.checkboxName + '"]');
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].onclick = null;
                    checkboxes[i].removeAttribute('checkedFlag');
                }
                
                // Apply mSingleCheck
                mScript.mSingleCheck(monitorConfig.singleCheckConfig);
                console.log('✅ Auto-Monitor: mSingleCheck reapplied successfully');
                
            } catch (error) {
                console.error('❌ Auto-Monitor: Error reapplying mSingleCheck:', error);
            }
        } else {
            console.error('❌ Auto-Monitor: mScript.mSingleCheck not available');
        }
    }
    
    /**
     * Fix multiple selection by keeping only the first checked
     */
    function fixMultipleSelection(checkboxes) {
        var firstChecked = null;
        
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                if (!firstChecked) {
                    firstChecked = checkboxes[i];
                } else {
                    console.log('🔧 Auto-Monitor: Unchecking extra selection:', checkboxes[i].id);
                    checkboxes[i].checked = false;
                    checkboxes[i].setAttribute('checkedFlag', '0');
                }
            }
        }
        
        // Trigger UI update if available
        if (window.updateSelectedUsers && typeof window.updateSelectedUsers === 'function') {
            updateSelectedUsers();
        }
        if (window.updateActionButtons && typeof window.updateActionButtons === 'function') {
            updateActionButtons();
        }
    }
    
    /**
     * Public API
     */
    window.mSingleCheckAutoMonitor = {
        init: initAutoMonitor,
        configure: function(config) {
            Object.assign(monitorConfig, config);
            console.log('✅ Auto-Monitor: Configuration updated');
        },
        start: startMonitoring,
        stop: function() {
            monitorConfig.isMonitoring = false;
            console.log('🛑 Auto-Monitor: Monitoring stopped');
        },
        forceReapply: reapplyMSingleCheck
    };
    
    console.log('✅ mSingleCheck Auto-Monitor loaded successfully');
    
})();


