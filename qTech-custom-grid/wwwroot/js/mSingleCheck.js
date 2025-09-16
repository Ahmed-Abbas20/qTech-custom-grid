//Developed By --> Eng : Marwan Hafez
//mscript@live.com
//First Release Under mScript Library [05/12/2011]
//singleCheck ==============================================================================================================================
//- For [Radio/CheckBox]
//args
//------------------
//- Name [Group Name]
//--> Or
//-Container
//------------------
//- flagName [flag as mark checked]
//- setIds [set unique ids]
//------------------
(function() {
    function singleCheck(a) {
        if (a) {
            var N = ((mCheck.isStr.notEmpty(a.Name)) ? (a.Name) : (null));
            var C = ((mCheck.isStr.notEmpty(a.Container)) ? (a.Container) : (null));
            var E = ((N) ? (mScript.getByNames(N.fTrim()).Elements) : (((C) ? (mScript.getByIds(C.fTrim()).getByTypes(['radio', 'checkbox']).Elements) : ([]))));
            for (var e = 0; e < E.length; e++) {
                var aFN = ((mCheck.isStr.notEmpty(a.flagName)) ? (a.flagName.fTrim()) : (null));
                var fN = ((aFN != null) ? (aFN) : ('checkedFlag'));
                E[e].setAttribute(fN, '0');
                if (mCheck.isBoolean(a.setIds)) {
                    if (a.setIds == true) {
                        E[e].id = fN + "_" + e;
                    }
                }
                E[e].onclick = function() {
                    for (var i = 0; i < E.length; i++) {
                        var box = E[i];
                        if (box.id != this.id) {
                            if (box.checked == true) {
                                if (mCheck.isSomeThing(a.OnUnCheck)) {
                                    a.OnUnCheck({ Element: box, Elements: E });
                                }
                            }
                            box.checked = false;
                            box.setAttribute(fN, '0');

                        }
                    }
                    if (this.getAttribute(fN) == '0') {
                        if (mCheck.isSomeThing(a.OnCheck)) {
                            a.OnCheck({ Element: this, Elements: E });
                        }
                        this.setAttribute(fN, '1');
                    }
                    else {
                        if (mCheck.isSomeThing(a.OnUnCheck)) {
                            a.OnUnCheck({ Element: this, Elements: E });
                        }
                        this.setAttribute(fN, '0');
                        this.checked = false;
                    }
                }
            }
        }
        return mScript.getByInst(E);
    };
    if (window.mScript) { window.mScript.mSingleCheck = singleCheck }
})();
//============================================================================================================================================