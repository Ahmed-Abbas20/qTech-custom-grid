//Copy Rights To Marwan Mohamed Hafez
//mscript@live.com
//mGrid V 1.0
//set_SCAPE
//#Region
function set_SCAPE(e, args, allowSetEvents) {
    if (e) {
        if (args) {
            //get cssClass
            var cssClass = ((mCheck.isStr.notEmpty(args['class'])) ? (args['class']) : (null));

            //if cssClass Not Null
            if (cssClass) {
                //set class to Element
                mScript.getByInst(e).cssClass(cssClass);
            }

            //get Style
            var Style = ((mCheck.isObj.notEmpty(args.Style)) ? (args.Style) : (null));
            //is Style Object Not Null
            if (Style) {
                //set Style to Element
                mScript.getByInst(e).Style(Style);
            }

            //get Attrs
            var Attrs = ((mCheck.isObj.notEmpty(args.Attrs)) ? (args.Attrs) : (null));
            //is Attrs Object Not Null
            if (Attrs) {
                //set Attrs to Element
                mScript.getByInst(e).Attrs(Attrs);
            }

            //get Props
            var Props = ((mCheck.isObj.notEmpty(args.Props)) ? (args.Props) : (null));
            //is Props Object Not Null
            if (Props) {
                //set Props to Element
                mScript.getByInst(e).Props(Props);
            }

            //if allow set for Events
            if (mCheck.isBoolean(allowSetEvents)) {
                if (allowSetEvents) {
                    //get Events
                    var Events = ((mCheck.isObj.notEmpty(args.Events)) ? (args.Events) : (null));
                    //is Event Object Not Null
                    if (Events) {
                        //loop over and set them to the table
                        for (var evt in Events) {
                            mScript.getByInst(e).Event.Bind({ Events: [evt], Function: Events[evt] });
                        }
                    }
                }
            }
        }
    }
}
//#EndRegion
//clearRows
//#Region
function clearRows(args) {
    if (args.Utility) {
        var Utility = args.Utility;
        mScript.getByInst(Utility.Table.Body).Remove();
    }
}
//#EndRegion
//alocateDataForServer
//#Region
function alocateDataForServer(args, realArgs) {

    //if args is objent and not empty
    if (mCheck.isObj.notEmpty(args)) {
        //get search object
        var dataObjectToServer = ((mCheck.isObj.notEmpty(args.searchObject)) ? (args.searchObject) : ({}));
        //get sort Column
        var sortColumn = ((mCheck.isStr.notEmpty(args.sortColumn)) ? (args.sortColumn) : (''));
        //get sort Order
        var sortOrder = ((mCheck.isStr.notEmpty(args.sortOrder)) ? (args.sortOrder) : (''));
        //get pageIndex
        // if Grid Scrollable pageIndex = 0
        var pageIndex = (args.AllowScroll == null || args.AllowScroll == undefined || args.AllowScroll == false) ? ((mCheck.isNum(args.pageIndex)) ? (args.pageIndex) : (0)) : -9;
        //get pageRowCounts
        var pageRowCounts = ((mCheck.isNum(args.pageRowCounts)) ? (args.pageRowCounts) : (10));
        //alocating basic data to the dataObjectToServer
        dataObjectToServer['sortColumn'] = sortColumn;
        dataObjectToServer['sortOrder'] = sortOrder;
        dataObjectToServer['pageIndex'] = Number(pageIndex);
        dataObjectToServer['pageRowCounts'] = pageRowCounts;
        //put base data and searchObject in the Utility
        var Utility = ((realArgs.Utility) ? (realArgs.Utility) : ({}));
        Utility.gridData = ((realArgs.Utility) ? (((Utility.gridData) ? (Utility.gridData) : ({}))) : ({}));
        Utility.gridData.sortColumn = sortColumn;
        Utility.gridData.sortOrder = sortOrder;
        Utility.gridData.pageIndex = pageIndex;
        Utility.gridData.pageRowCounts = pageRowCounts;
        Utility.gridData.searchObject = ((mCheck.isObj.notEmpty(args.searchObject)) ? (args.searchObject) : (null));
        //set Utility to the realArgs Utility
        realArgs.Utility = Utility;
        //return dataObjectToServer
        return dataObjectToServer
    }

    //return null
    return null;
}
//#EndRegion
//getData
//#Region
function getData(dataObjectToServer, args) {
    //get Loader
    var Loader = ((mCheck.isSomeThing(args.Utility.Loader)) ? (args.Utility.Loader) : ({ style: { display: 'block' } }));
    //Show Loader
    Loader.style.display = 'block';

    //objFromServer
    var objFromServer = null;
    //get url
    var url = ((typeof (args.Url) == "function") ? (args.Url()) : (args.Url));
    //if url exist and not empty string
    if (url) {
        //get requestType
        var requestType = ((mCheck.isStr.notEmpty(args.requestType)) ? (args.requestType) : (null));
        //if requestType not null
        if (requestType) {
            mScript.Ajax
                (
                    {
                        Method: requestType
                        ,
                        Url: url + ((requestType == 'GET') ? ("?" + mProto.Object(dataObjectToServer).toQueryString()) : (''))
                        ,
                        contentType: 'application/json; charset=utf-8'
                        ,
                        Data: ((requestType == 'POST') ? (mProto.Object(dataObjectToServer).Stringfy().replace(/\\/g, "\\\\").replace(/\/\//g, '/')) : (null))
                        ,
                        Async: false
                        ,
                        onSuccess: function (r) {
                            //eval
                            objFromServer = eval('(' + r.Json + ')');
                            //put Data in utility
                            args.Utility.Data = objFromServer.Data;
                            //put rowsCount in utility
                            args.Utility.gridData.rowsCount = Number(objFromServer.rowsCount);
                            //put page index in utility
                            args.Utility.gridData.pageIndex = Number(objFromServer.pageIndex);
                            //put pages count in utility
                            args.Utility.gridData.pagesCount = Number(objFromServer.pagesCount);
                            //put customResult in utility
                            args.Utility.customResult = objFromServer.customResult;
                        }
                        ,
                        onError: function (e) {
                            //alert('حدث خطأ')
                            alertErrorPopUp();
                        }
                    }
                );
        }
    }
    else {
        if (mCheck.isAry(args.dataTable)) {
            args.Utility.Data = objFromServer = args.dataTable;

            args.Utility.rowsCount = objFromServer.rowsCount = args.dataTable.length;
            args.Utility.gridData.pageIndex = 0;
            args.Utility.gridData.pagesCount = 0;
        }
    }
    //Hide Loader
    Loader.style.display = 'none';
    //return objFromServer
    return objFromServer;
}
//#EndRegion
//controlPagingButtons
//#Region
function controlPagingButtons(args) {
    //Check Grid Not Scrollable
    if (args.AllowScroll == null || args.AllowScroll == undefined || args.AllowScroll == false) {
        //get utility
        var utility = args.Utility;
        //get Pager
        var pager = ((utility.Pager) ? (utility.Pager) : ({}))
        //get page Index
        var pIndex = Number(utility.gridData.pageIndex);
        //get rows count
        var rsCount = Number(utility.gridData.rowsCount);
        //get pageRowCount
        var pageRowCounts = Number(utility.gridData.pageRowCounts);
        //get pagesCount
        var pagesCount = Number(utility.gridData.pagesCount);
        //get nextButton
        var nextButton = ((pager.nextButton) ? (pager.nextButton) : ({ disabled: false }));
        //get backButton
        var backButton = ((pager.backButton) ? (pager.backButton) : ({ disabled: false }));
        //get firstButton
        var firstButton = ((pager.firstButton) ? (pager.firstButton) : ({ disabled: false }));
        //get lastButton
        var lastButton = ((pager.lastButton) ? (pager.lastButton) : ({ disabled: false }));
        //Data Filled Only 1 Page
        if (rsCount <= pageRowCounts) {
            firstButton.disabled = true;
            backButton.disabled = true;
            nextButton.disabled = true;
            lastButton.disabled = true;
        }
        //Page between First & Last
        else if (pIndex > 0 && pIndex < (pagesCount - 1)) {
            firstButton.disabled = false;
            backButton.disabled = false;
            nextButton.disabled = false;
            lastButton.disabled = false;
        }
        //First Page
        else if (pIndex == 0) {
            firstButton.disabled = true;
            backButton.disabled = true;
            nextButton.disabled = false;
            lastButton.disabled = false;
        }
        //Last Page
        else if (pIndex == (pagesCount - 1)) {
            firstButton.disabled = false;
            backButton.disabled = false;
            nextButton.disabled = true;
            lastButton.disabled = true;
        }
    }
}
//#EndRegion
//setPagerData
//#Region
function setPagerData(args) {
    //Check Grid Not Scrollable
    if (args.AllowScroll == null || args.AllowScroll == undefined || args.AllowScroll == false) {
        var pagerNotEmpty = mCheck.isSomeThing(args.Utility.Pager);

        var currentPageText = ((pagerNotEmpty) ? (((mCheck.isSomeThing(args.Utility.Pager.currentPageText)) ? (args.Utility.Pager.currentPageText) : ({ value: '' }))) : ({ value: '' }));
        var rowCountText = ((pagerNotEmpty) ? (((mCheck.isSomeThing(args.Utility.Pager.rowCountText)) ? (args.Utility.Pager.rowCountText) : ({ value: '' }))) : ({ value: '' }));

        var pagesCountLabel = ((pagerNotEmpty) ? (((mCheck.isSomeThing(args.Utility.Pager.pagesCountLabel)) ? (args.Utility.Pager.pagesCountLabel) : ({ innerHTML: '' }))) : ({ innerHTML: '' }));
        var rowsCountLabel = ((pagerNotEmpty) ? (((mCheck.isSomeThing(args.Utility.Pager.rowsCountLabel)) ? (args.Utility.Pager.rowsCountLabel) : ({ innerHTML: '' }))) : ({ innerHTML: '' }));

        currentPageText.value = Number(args.Utility.gridData.pageIndex) + 1;
        rowCountText.value = args.Utility.gridData.pageRowCounts;

        $("input[id$='" + currentPageText.id + "']").removeAttr('onkeydown').keydown(function (event) {
            return numbers_only_grid_page(event);
        });
        pagesCountLabel.innerHTML = " صفحة " + (Number(args.Utility.gridData.pageIndex) + 1) + " من " + (args.Utility.gridData.pagesCount);
        rowsCountLabel.innerHTML = " إجمالي " + args.Utility.gridData.rowsCount;
    }
}
//#EndRegion
//removeUtility
//#Region
function removeUtility(args) {
    if (args.Utility) {
        delete args['Utility'];
    }
}
//#EndRegion
//showGrid
//#Region
function showGrid(args, Show) {
    //get Table
    var Table = ((mCheck.isObj.notEmpty(args.Table)) ? (((mCheck.isStr.notEmpty(args.Table.ID)) ? (document.getElementById(args.Table.ID)) : (undefined))) : (undefined));
    //get Pager
    var Pager = ((mCheck.isObj.notEmpty(args.Pager)) ? (((mCheck.isObj.notEmpty(args.Pager.Container)) ? (((mCheck.isStr.notEmpty(args.Pager.Container.ID)) ? (document.getElementById(args.Pager.Container.ID)) : (undefined))) : (undefined))) : (undefined));
    //if Table
    if (Table) {
        //set display
        Table.setAttribute('style', 'display:' + ((Show) ? 'table' : 'none !important') + '');
    }

    //if Pager
    if (Pager) {
        if (args.Utility) {
            //if pagesCount !=-1
            if (Number(args.Utility.gridData.pagesCount != -1)) {
                //set display
                Pager.setAttribute('style', 'display:' + ((Show) ? 'block' : 'none !important') + '');
            }
        }
        else {
            //set display
            Pager.setAttribute('style', 'display:' + ((Show) ? 'block' : 'none !important') + '');
        }
    }

}
//#EndRegion
//showEmpty
//#Region
function showEmpty(args, Show) {

    //get Table
    var Empty = ((mCheck.isObj.notEmpty(args.Empty)) ? (((mCheck.isStr.notEmpty(args.Empty.ID)) ? (document.getElementById(args.Empty.ID)) : (undefined))) : (undefined));
    //if Empty
    if (Empty) {
        //set Empty
        Empty.setAttribute('style', 'display:' + ((Show) ? 'block' : 'none !important') + '');
        //Exec onGridEmpty if Appears
        if (Show) {
            if (document.getElementById(args.Empty.ID).hasAttribute('class'))
                document.getElementById(args.Empty.ID).removeAttribute('class');
            document.getElementById(args.Empty.ID).setAttribute('class', 'mgrid_empty_data_block');
            if (mCheck.isFunc(args.Empty.onGridEmpty))
                args.Empty.onGridEmpty(Empty);
        }
    }
}

function rerenderEmpty(args) {
    if (args.Empty && args.Empty.ID) {
        var div_Empty = document.createElement("div");
        div_Empty.id = args.Empty.ID;
        div_Empty.className = "mgrid_empty_data";

        elem = document.getElementById(args.Empty.ID);
        if (elem) {
            elem.parentNode.removeChild(elem);
        }
        var table = document.getElementById(args.Table.ID);

        table.parentNode.insertBefore(div_Empty, table.nextSibling);
        return div_Empty;
    }
    return null;
}
//#EndRegion

//setTable
//#Region
function set_Table(args) {

    //get table object
    var tableObject = ((mCheck.isObj.notEmpty(args.Table)) ? (args.Table) : (null));
    //if tableObject is Not Null
    if (tableObject) {
        //get table id
        var tableId = ((mCheck.isStr.notEmpty(tableObject.ID)) ? (tableObject.ID) : (null));
        //if tableId Not Null
        if (tableId) {
            //get table Dom object
            var Table = document.getElementById(tableId);
            //if Table is Not Null
            if (Table) {
                if (Table.tagName == 'TABLE') {
                    //set table Things [Style,Class,Attrs,Props,Events]
                    set_SCAPE(Table, tableObject, true);

                    //IF Scroll Grid Apply ClassCss For Scroll
                    if (args.AllowScroll == true && Table.className == "")
                        Table.className = "gridScroll";
                    //get caption object
                    var captionObject = ((mCheck.isObj.notEmpty(tableObject.Caption)) ? (tableObject.Caption) : (null));
                    //create variable to hole Caption mScript Object
                    var Caption = undefined;
                    //if captionObject Not Null
                    if (captionObject) {
                        //create caption Dom object
                        Caption = mScript.getByInst(Table).Add('CAPTION');
                        //get caption id
                        var captionId = ((mCheck.isStr.notEmpty(captionObject.ID)) ? (captionObject.ID) : (null));
                        //if captionId Not Null
                        if (captionId) {
                            //set captionId to Caption
                            Caption.Attrs('id', captionId);
                        }
                        //get Text from captionObject
                        var Text = ((mCheck.isStr.notEmpty(captionObject.Text)) ? (captionObject.Text) : (null));
                        //if Text Not Null
                        if (Text) {
                            //set Text to Caption to [innerHTML Property]
                            Caption.Html(Text)
                        }
                        //set table caption [Style,Class,Attrs,Props,Events]
                        set_SCAPE(Caption, captionObject, true);
                        //if onCaptionComplete exist execute it
                        if (mCheck.isFunc(captionObject.onCaptionComplete)) {
                            captionObject.onCaptionComplete(Caption.Element);
                        }
                    }

                    //Initiate Utility Object
                    var Utility = args.Utility;
                    Utility.Table = Table;
                    Utility.Table.Caption = ((Caption) ? (Caption.Element) : (null));

                    args.Utility = Utility;

                    return Table;
                }
            }
        }
    }
    return null;
}
//#EndRegion
//set_Headers
//#Region
function set_Headers(args) {
    //get columns from object
    var Columns = ((mCheck.isAry.notEmpty(args.Columns)) ? (((mProto.Array(args.Columns).Every(mCheck.isObj)) ? (args.Columns) : (null))) : (null));
    //if columns not null
    if (Columns) {
        //create thead
        var tHead = mScript.getByInst(args.Utility.Table).Add('THEAD');
        //create tr for header
        var trHeader = tHead.Add('TR');
        //get tHead Object
        var tableHeadObj = ((mCheck.isObj.notEmpty(args.Table.Header)) ? (args.Table.Header) : (null));
        //if tableHeadObj not null
        if (tableHeadObj != null) {
            //set [style,class,attributes,properties,events]
            set_SCAPE(tHead.Element, tableHeadObj, true);
            //get tRHead Object
            var tRHeadObject = ((mCheck.isObj.notEmpty(tableHeadObj.Row)) ? (tableHeadObj.Row) : (null));
            //set [style,class,attributes,properties,events]
            set_SCAPE(trHeader.Element, tRHeadObject, true);
        }

        //Initiate Utility Object
        var Utility = args.Utility;
        Utility.Table.Header = tHead.Element;
        Utility.Table.Header.Row = trHeader.Element;
        Utility.Table.Header.Row.Columns = {};
        //get initial sortColumn
        var sortColumn = ((mCheck.isStr.notEmpty(args.sortColumn)) ? (args.sortColumn) : (''));
        //get initial sortOrder
        var sortOrder = ((mCheck.isStr.notEmpty(args.sortOrder)) ? (args.sortOrder) : (''));
        //sort Tool Tip
        var sortingToolTip = ((mCheck.isBoolean(args.sortingToolTip)) ? (args.sortingToolTip) : (false));
        //sortingNotificator
        var sortingNotificator = ((mCheck.isBoolean(args.sortingNotificator)) ? (args.sortingNotificator) : (false));
        //loop over Columns
        Columns
            .Each
            (
                function (Column, cIndx) {
                    //Check column name is set 
                    if (mCheck.isStr.notEmpty(Column.Name)) {
                        //Get column header
                        var h = Column.Header;
                        //get sort
                        var Sort = ((mCheck.isBoolean(Column.Sort)) ? (Column.Sort) : (false));
                        //get header text
                        var headerText = ((mCheck.isObj(h)) ? (((mCheck.isStr(h.Text)) ? (h.Text) : (Column.Name))) : (Column.Name));
                        //get header events
                        var headerEvents = ((mCheck.isObj(h)) ? (((mCheck.isObj(h.Events)) ? (((mProto.Object(h.Events).Every(mCheck.isFunc)) ? (h.Events) : (null))) : (null))) : (null));
                        //preventDefaultClickAction
                        var preventDefaultClickAction = ((mCheck.isObj(h)) ? (((mCheck.isBoolean(h.preventDefaultClickAction)) ? (h.preventDefaultClickAction) : (false))) : (false));
                        //create Dom TH
                        if (args.hideOverFlow && cIndx == 0) {
                            var THCollapse = trHeader.Add('TH');
                            THCollapse.Style('width', '30px');
                            THCollapse.Element.id = args.Table.ID + "_th_Collapse";
                        }
                        var TH = trHeader.Add('TH');

                        //create Locals for SPAN Text & SPAN IMG , IMG
                        var spnText, spnImg, ImgT;
                        //create Locals for Events Regarding sortingNotificator Items
                        var spnTextEvents = ((mCheck.isObj(h.spanText)) ? (((mCheck.isObj(h.spanText.Events)) ? (((mProto.Object(h.spanText.Events).Every(mCheck.isFunc)) ? (h.spanText.Events) : (null))) : (null))) : (null))
                            , spnImgEvents = ((mCheck.isObj(h.spanImg)) ? (((mCheck.isObj(h.spanImg.Events)) ? (((mProto.Object(h.spanImg.Events).Every(mCheck.isFunc)) ? (h.spanImg.Events) : (null))) : (null))) : (null))
                            , ImgTEvents = ((mCheck.isObj(h.spanImg)) ? (((mCheck.isObj(h.spanImg.Img)) ? (((mCheck.isObj(h.spanImg.Img.Events)) ? (((mProto.Object(h.spanImg.Img.Events).Every(mCheck.isFunc)) ? (h.spanImg.Img.Events) : (null))) : (null))) : (null))) : (null));

                        if (sortingNotificator == true && Sort == true) {
                            //set header Items [for Sorting Notifecator]
                            spnText = TH.Add('SPAN');
                            if (spnText && spnText.Element)
                                spnText.Element.id = "spn_Mgrid_h_" + Column.Name;
                            spnText.Html(headerText);
                            set_SCAPE(spnText.Element, h.spanText);

                            spnImg = TH.Add('SPAN');
                            spnImg.Style({ verticalAlign: 'middle' });
                            set_SCAPE(spnImg.Element, h.spanImg);

                            ImgT = spnImg.Add('IMG');
                            ImgT.Props({ src: '../../styles/Default/Images/sortUpDownArrow.png' });
                            if (h.spanImg)
                                set_SCAPE(ImgT.Element, h.spanImg.Img);
                        }
                        else {
                            //set header text to TH
                            TH.Html(headerText);
                        }

                        //set Column To Th Object
                        TH.Element.Column = Column;

                        if (sortingNotificator == true && Sort == true) {
                            spnText.Element.Column = Column;
                            spnImg.Element.Column = Column;
                            ImgT.Element.Column = Column;
                        }

                        //set Sort Order
                        if (sortColumn.fTrim() != '') {
                            if (Column.Name.fTrim() == sortColumn.fTrim()) {
                                TH.Element.sortOrder == sortOrder.fTrim();
                                if (sortingNotificator) {
                                    ImgT.Element.src = ((sortOrder == "ASC") ? ("../../styles/Default/Images/sortUpArrow.png") : ("../../styles/Default/Images/sortDownArrow.png"));
                                }
                            }
                        }
                        //get base [width,height]
                        var width = ((mCheck.isStr.notEmpty(Column.Width)) ? (((Column.Width.toLowerCase().indexOf('px') != -1) ? (Column.Width) : (((mCheck.isNum(Column.Width)) ? (Column.Width.toString() + "px") : (null))))) : (null));
                        var height = ((mCheck.isStr.notEmpty(Column.Height)) ? (((Column.Height.toLowerCase().indexOf('px') != -1) ? (Column.Height) : (((mCheck.isNum(Column.Height)) ? (Column.Height.toString() + "px") : (null))))) : (null));
                        //set base [width,heigth]
                        if (width) {
                            TH.Style('width', width);
                        }
                        if (height) {
                            TH.Style('height', height);
                        }
                        var cssClass = ((mCheck.isStr.notEmpty(Column.cssClass)) ? (Column.cssClass) : (null));
                        //set class to Element
                        if (cssClass) {
                            mScript.getByInst(TH).cssClass(cssClass);
                        }
                        //set [Style,Class,Attrs,Props] to TH
                        set_SCAPE(TH.Element, h);
                        //if sorting is true
                        if (Sort == true) {
                            TH.Element.setAttribute('Sort', '1');
                            TH.Style({ cursor: 'pointer' });
                        }
                        //Bind Click Event To TH Element
                        TH.Element.onclick = function (evt) {
                            //get TH Element From Event
                            var e = mScript.getFromEvent(evt);
                            //if Sort is enabled
                            if (Sort == true) {
                                //Do Sort
                                Sorting(e.Element, args);
                            }
                            //if headerEvents is set
                            if (headerEvents) {
                                //if custom event click set
                                if (headerEvents.click) {
                                    //execute custom click event
                                    headerEvents.click(evt);
                                }
                            }
                        }

                        //loop over given events to bind it to TH
                        for (var evt in headerEvents) {
                            if (evt.toString().toLowerCase() != 'click') {
                                mScript.getByInst(TH).Event.Bind({ Events: [evt], Function: headerEvents[evt] });
                            }
                        }

                        //loop over given events to bind it to spnText
                        for (var evt in spnTextEvents) {
                            if (evt.toString().toLowerCase() != 'click') {
                                mScript.getByInst(spnText).Event.Bind({ Events: [evt], Function: spnTextEvents[evt] });
                            }
                        }

                        //loop over given events to bind it to spnImg
                        for (var evt in spnImgEvents) {
                            if (evt.toString().toLowerCase() != 'click') {
                                mScript.getByInst(spnImg).Event.Bind({ Events: [evt], Function: spnImgEvents[evt] });
                            }
                        }

                        //loop over given events to bind it to Img
                        for (var evt in ImgTEvents) {
                            if (evt.toString().toLowerCase() != 'click') {
                                mScript.getByInst(ImgT).Event.Bind({ Events: [evt], Function: ImgTEvents[evt] });
                            }
                        }


                        //Assign to local Utility.Table.Header
                        Utility.Table.Header.Row.Columns[Column.Name] = TH.Element;

                        if (Sort && sortingNotificator) {
                            Utility.Table.Header.Row.Columns[Column.Name].spanText = spnText.Element;
                            Utility.Table.Header.Row.Columns[Column.Name].spanImg = spnImg.Element;
                            Utility.Table.Header.Row.Columns[Column.Name].spanImg.Img = ImgT.Element;
                        }


                        //execute appendObjects function is given
                        if (mCheck.isFunc(h.onHeaderCellComplete)) {
                            h.onHeaderCellComplete(TH.Element, headerText);
                        }
                    }
                });
        if (sortingToolTip) {
            start_client_grid_header_tooltip(mProto.Object(Utility.Table.Header.Row.Columns).toArray());
        }
        //Initiate Utility.Table.Header
        args.Utility.Table.Header = Utility.Table.Header;
        //if tableHeadObj not null
        if (tableHeadObj) {
            //if onHeaderComplete exist execute it 
            if (mCheck.isFunc(tableHeadObj.onHeaderComplete)) {
                tableHeadObj.onHeaderComplete(Utility.Table.Header);
            }
        }
        //return Utility.Table.Header
        return Utility.Table.Header;
    }
    //return null
    return null;
}
//#EndRegion
//set_Rows
//#Region
function set_Rows(args) {

    //get data array [from database]
    var dataAry = ((mCheck.isAry.notEmpty(args.Utility.Data)) ? (((mProto.Array(args.Utility.Data).Every(mCheck.isObj)) ? (args.Utility.Data) : (null))) : (null));
    //get columns object
    var Columns = ((mCheck.isAry.notEmpty(args.Columns)) ? (((mProto.Array(args.Columns).Every(mCheck.isObj)) ? (args.Columns) : (null))) : (null));
    //get scrolling
    var Scrolling = ((mCheck.isBoolean(args.Scrolling)) ? (args.Scrolling) : (false));
    //if columns is not null
    if (Columns) {
        //if data array not null
        if (dataAry) {
            //create tbody to the table
            var tBody = mScript.getByInst(args.Utility.Table).Add('TBODY').Element;
            //get body object
            var bodyObject = ((mCheck.isObj.notEmpty(args.Table.Body)) ? (args.Table.Body) : (null));
            //if body not null
            if (bodyObject) {
                //set [style,class,attributes,properties]
                set_SCAPE(tBody, bodyObject, true);
            }
            //get Utility
            var Utility = args.Utility;
            //set Body
            Utility.Table.Body = tBody;

            //if scrolling allowed
            if (Scrolling) {
                //create tr
                var mTR = mScript.getByInst(tBody).Add('TR');
                //set Row to Utility
                Utility.Table.Body.Row = mTR.Element;

                //get rowObject
                var rowObject = ((bodyObject) ? (((mCheck.isObj.notEmpty(args.Table.Body.Row)) ? (args.Table.Body.Row) : (null))) : (null));
                //if rowObject not null
                if (rowObject) {
                    //set_SCAPE for TR
                    set_SCAPE(mTR.Element, rowObject);
                    //if rowContainer Have onRowComplete
                    if (args.Table.Body.Row.onRowComplete) {
                        args.Table.Body.Row.onRowComplete(mTR.Element);
                    }
                }


                //create td
                var mTD = mTR.Add('TD').Attrs({ colSpan: args.Columns.length });

                //set Cell to Utility
                Utility.Table.Body.Row.Cell = mTD.Element;

                //get cellObject
                var cellObject = ((rowObject) ? (((mCheck.isObj.notEmpty(args.Table.Body.Row.Cell)) ? (args.Table.Body.Row.Cell) : (null))) : (null));
                //if cellObject not null
                if (cellObject) {
                    //set_SCAPE for td
                    set_SCAPE(mTD.Element, cellObject);
                    //if tdContainer Have onRowComplete

                    if (args.Table.Body.Row.Cell.onCellComplete) {
                        args.Table.Body.Row.Cell.onCellComplete(mTD.Element);
                    }
                }
                //create Div
                var mDiv = mTD.Add('DIV');
                //set Div to Utility
                Utility.Table.Body.Row.Cell.Div = mDiv.Element;


                //get divObject
                var divObject = ((cellObject) ? (((mCheck.isObj.notEmpty(args.Table.Body.Row.Cell.Div)) ? (args.Table.Body.Row.Cell.Div) : (null))) : (null));
                //if divObject not null
                if (divObject) {
                    //set_SCAPE for div
                    set_SCAPE(mDiv.Element, divObject);
                    mDiv.Style({ direction: ((mCheck.Browser().isIE()) ? ('ltr') : ((((mScript.Browser().Name.toLowerCase() == 'firefox') && (parseInt(mScript.Browser().Version) >= 4)) ? ('ltr') : ('rtl')))) });
                    //if divContainer Have onRowComplete
                    if (args.Table.Body.Row.Cell.Div.onDivComplete) {
                        args.Table.Body.Row.Cell.Div.onDivComplete(mDiv.Element);
                    }
                }
                //create Table
                var mTable = mDiv.Add('TABLE');
                //set Table to Utility
                Utility.Table.Body.Row.Cell.Div.Table = mTable.Element;

                //get tableObject
                var tableObject = ((divObject) ? (((mCheck.isObj.notEmpty(args.Table.Body.Row.Cell.Div.Table)) ? (args.Table.Body.Row.Cell.Div.Table) : (null))) : (null));
                //if tableObject not null
                if (tableObject) {
                    //set_SCAPE for table
                    set_SCAPE(mTable.Element, tableObject);
                }
                //create tBody
                var mBody = mTable.Add('tbody');
                //set Body to Utility
                Utility.Table.Body.Row.Cell.Div.Table.Body = mBody.Element;

                //get bodyObject
                bodyObject = ((tableObject) ? (((mCheck.isObj.notEmpty(args.Table.Body.Row.Cell.Div.Table.Body)) ? (args.Table.Body.Row.Cell.Div.Table.Body) : (null))) : (null));
                //if bodyObject not null
                if (bodyObject) {
                    //set_SCAPE for body
                    set_SCAPE(mBody.Element, bodyObject);
                }
                //set body to appent to to the inner tbody
                tBody = mBody.Element;

                //set Rows to Utility
                Utility.Table.Body.Row.Cell.Div.Table.Body.Rows = [];
            }
            else {
                //creat Rows array of objects in the utility object
                Utility.Table.Body.Rows = [];
            }

            //loop over the dataAry to bind it to the grid if the tamplet have column names contained in the dataAry of objects
            var trFragment = new DocumentFragment()
            dataAry
                .Each
                (
                    function (Row, rowIndx) {
                        //create TR for the row
                        // var TR = mScript.getByInst(tBody).Add('TR').Element;
                        var TR = document.createElement("TR");
                        //if bodyObject not null
                        if (bodyObject) {
                            var rowObject = ((mCheck.isObj.notEmpty(bodyObject.Row)) ? (bodyObject.Row) : (null));
                            //if rowObject not null
                            if (rowObject) {
                                //set [style,class,attributes,properties]
                                set_SCAPE(TR, rowObject, true);
                            }
                        }
                        //get object Rows in the Utility Object
                        var rows = ((Scrolling) ? (Utility.Table.Body.Row.Cell.Div.Table.Body.Rows) : (Utility.Table.Body.Rows));
                        //create object row in the rows object in the Utility
                        var row = rows[rows.length] = TR;
                        row.Index = rowIndx;
                        row.Columns = {};
                        row.Data = Row;

                        //loop over columns to create tds
                        var tdsFragment = new DocumentFragment();
                        var lisFragment = new DocumentFragment();
                        Columns
                            .Each
                            (
                                function (Column, colIndx) {
                                    //create td
                                    //  var TD = mScript.getByInst(TR).Add('TD').Element;
                                    var TD = document.createElement("TD");
                                    var TDLI;
                                    //get cell object
                                    var cell = ((mCheck.isObj.notEmpty(Column.Cell)) ? (Column.Cell) : (null));
                                    //if Data have the column name
                                    if (Row[Column.Name] != undefined) {
                                        //bint its text to the html
                                        var htmlcellval = ((Row[Column.Name].constructor == String) ? (Row[Column.Name].toString()) : (((Row[Column.Name].constructor == Object) ? (Row[Column.Name].Value.toString()) : (Row[Column.Name].toString()))));
                                        TD.innerHTML = htmlcellval;

                                    }
                                    //set the row object a new TD with the column name
                                    row.Columns[Column.Name] = TD;

                                    //get base [width,height]
                                    var width = ((mCheck.isStr.notEmpty(Column.Width)) ? (((Column.Width.toLowerCase().indexOf('px') != -1) ? (Column.Width) : (((mCheck.isNum(Column.Width)) ? (Column.Width.toString() + "px") : (null))))) : (null));
                                    var height = ((mCheck.isStr.notEmpty(Column.Height)) ? (((Column.Height.toLowerCase().indexOf('px') != -1) ? (Column.Height) : (((mCheck.isNum(Column.Height)) ? (Column.Height.toString() + "px") : (null))))) : (null));
                                    //set base [width,heigth]
                                    if (width) {
                                        // mScript.getByInst(TD).Style('width', width);
                                        TD.width = width;
                                    }
                                    if (height) {
                                        // mScript.getByInst(TD).Style('height', height);
                                        TD.height = height;

                                    }
                                    var cssClass = ((mCheck.isStr.notEmpty(Column.cssClass)) ? (Column.cssClass) : (null));
                                    //set class to Element
                                    if (cssClass) {
                                        mScript.getByInst(TD).cssClass(cssClass);
                                    }
                                    //if cell not null
                                    if (cell) {
                                        //set [style,class,attributes,properties]
                                        set_SCAPE(TD, Column.Cell, true);
                                        //if append object exist and is function
                                        if (mCheck.isFunc(cell.onCellComplete)) {
                                            //execute append objects
                                            cell.onCellComplete(TD, ((Row[Column.Name] != undefined) ? (Row[Column.Name]) : ('')), Row, rowIndx);
                                        }
                                    }
                                    if (args.hideOverFlow) {
                                        lisFragment.appendChild(set_liRowChild(args, Column, TD.innerHTML, rowIndx));
                                        if (colIndx == 0)
                                            tdsFragment.appendChild(set_ColPlusIcn(args, rowIndx, TR));
                                    }
                                    tdsFragment.appendChild(TD);
                                }
                            );
                        TR.appendChild(tdsFragment)

                        //set Indx
                        TR.Index = rowIndx;
                        //set Columns
                        TR.Columns = row.Columns;
                        //set Data
                        TR.Data = Row;

                        //set rows to the Utility Object
                        ((Scrolling) ? (Utility.Table.Body.Row.Cell.Div.Table.Body.Rows = rows) : (Utility.Table.Body.Rows = rows));
                        //if onRowComplete event not null
                        trFragment.appendChild(TR);
                        if (args.hideOverFlow) {//Add Child Collapsable Details
                            var TRChild = set_rowChild(args, Columns, lisFragment, rowIndx);
                            trFragment.appendChild(TRChild);
                        }
                        // trFragment.appendChild()
                        if (mCheck.isFunc(args.onRowComplete)) {
                            //execute the function
                            args.onRowComplete(row);
                        }
                        //if its Final Row
                        if (dataAry.length == rowIndx + 1) {
                            //if onGridRowsComplete event not null
                            tBody.appendChild(trFragment);
                            if (args.hideOverFlow) {
                                set_Collapse(args, tBody, Columns);
                            }
                            if (mCheck.isFunc(args.onGridRowsComplete)) {
                                //execute the function

                                args.onGridRowsComplete(args.Utility);
                            }
                        }
                    }
                );
            //return array of rows objects
            return ((args.Utility.Table.Body.Rows) ? (args.Utility.Table.Body.Rows) : (null));
        }
    }
    //return null
    return null;
}
//#EndRegion
//set_Collapse
function set_Collapse(args, tbody, Columns) {
    if (args.hideOverFlow) {
        var div_maken_content = document.getElementById("div_maken_content");// makeen Master
        if (!div_maken_content)
            div_maken_content = document.getElementById("content"); //Old Master
        args.Table.countofDisplayedCols = 1;//1 mean the column of Collapse Icon
        if (div_maken_content) {
            for (var collen = Columns.length - 1; collen >= 0; collen--) {
                var showColumn = (div_maken_content.clientWidth >= tbody.clientWidth);
                if ((showColumn && args.Utility.Table.Header.Row.Columns[Columns[collen].Name].style.display == 'none') || !showColumn)
                    GridHelper.ShowHideGridColumn(args, [Columns[collen].Name], showColumn, !showColumn);
                if (!showColumn)
                    args.Table.hasHidedColumns = true;
                else
                    args.Table.countofDisplayedCols++;
            }
            if (!args.Table.hasHidedColumns)
                ShowHideGridCollapseIcnColumn(args);
        }
    }
}
function ShowHideGridCollapseIcnColumn(tbl_GridObj) {
    if (tbl_GridObj.Utility.Table.Body) {
        document.getElementById(tbl_GridObj.Table.ID + "_th_Collapse").remove();
        var el = tbl_GridObj.Utility.Table.Body.getElementsByClassName("dtr-control");
        var len = el.length;
        for (var i = 0; i < len; i++) {
            if (tbl_GridObj.hideOverFlow) {
                if (el && el.length > 0)
                    el[0].remove();
            }
        }
    }
}
function set_rowChild(args, Columns, lisFragment, rowIndx) {
    var TRChild = document.createElement("TR");
    TRChild.className = "child";
    TRChild.id = args.Table.ID + '_trchild_' + rowIndx;
    TRChild.style.display = 'none';
    var TDChild = document.createElement("TD");
    TDChild.id = args.Table.ID + '_tr_td_child_' + rowIndx;
    TDChild.className = "child";
    TDChild.setAttribute('colspan', Columns.length);
    var ULChild = document.createElement("UL");
    ULChild.id = args.Table.ID + '_ulchild_' + rowIndx;
    ULChild.className = 'dtr-details';
    ULChild.appendChild(lisFragment);
    //ULChild.setAttribute('data-dtr-index', '4');
    TDChild.appendChild(ULChild);
    TRChild.appendChild(TDChild);
    return TRChild;
}
function set_liRowChild(args, Column, value, rowIndx) {
    var li = document.createElement("li");
    li.id = args.Table.ID + '_' + Column.Name + '_lichild_' + rowIndx;
    var spanTitle = document.createElement("span");
    spanTitle.id = args.Table.ID + '_' + Column.Name + '_Title_lichild_' + rowIndx;
    spanTitle.className = 'dtr-title';
    spanTitle.innerHTML = Column.Header.Text;
    var spanValue = document.createElement("span");
    spanValue.className = 'dtr-data';
    spanValue.innerHTML = value;
    li.appendChild(spanTitle);
    li.appendChild(spanValue);
    li.style.display = 'none';
    return li;
}
function set_ShowHidCollapseClick(args, rowIndx, TR) {
    if (args.Table.hasHidedColumns) {
        var trch = document.getElementById(args.Table.ID + '_trchild_' + rowIndx);
        document.getElementById(args.Table.ID + '_tr_td_child_' + rowIndx).colSpan = args.Table.countofDisplayedCols;
        if (trch.style.display == 'none') {
            TR.classList.add('dt-hasChild');
            TR.classList.add('parent');
        }
        else {
            TR.classList.remove('dt-hasChild');
            TR.classList.remove('parent');
        }
        trch.style.display = (trch.style.display == 'none' ? '' : 'none');
    }
}
function set_ColPlusIcn(args, rowIndx, TR) {
    var TDCollapse = document.createElement("TD");
    TDCollapse.className = "dtr-control";
    TDCollapse.style.width = "30px";
    TDCollapse.addEventListener("click", set_ShowHidCollapseClick.bind(this, args, rowIndx, TR));
    return TDCollapse;
}
//#Region
//#EndRegion
//set_Pager
//#Region
function set_Pager(args) {
    //get pager object IF GRID NOT SCROLLABAL
    if (args.AllowScroll == null || args.AllowScroll == undefined || args.AllowScroll == false) {
        var Pager = ((mCheck.isObj.notEmpty(args.Pager)) ? (args.Pager) : (null));
        //if page object not null
        if (Pager) {
            //get pager Container
            var containerObj = ((mCheck.isObj.notEmpty(Pager.Container)) ? (Pager.Container) : (null));
            if (containerObj) {
                //get container Dom
                var Container = ((mCheck.isStr.notEmpty(containerObj.ID)) ? (document.getElementById(containerObj.ID)) : (undefined));
                //Rerender Pager
                Container = rerenderPager(Container, args);
                //if container is not undefined
                if (Container) {
                    //set SCAPE for Container
                    set_SCAPE(Container, containerObj, true);
                    //put Pager object in utility
                    args.Utility.Pager = Container;
                    //loop over pager object
                    mProto.Object(Pager).Each(function (k, v) {
                        //if k is one of the pager buttons
                        if (k.toLowerCase() == "nextbutton" || k.toLowerCase() == "backbutton" || k.toLowerCase() == "firstbutton" || k.toLowerCase() == "lastbutton") {
                            //get button object
                            var buttonObject = ((mCheck.isObj.notEmpty(v)) ? (v) : (null));
                            //if button object not null
                            if (buttonObject) {
                                //get button dom object
                                var Button = ((mCheck.isStr.notEmpty(buttonObject.ID)) ? (document.getElementById(buttonObject.ID)) : (null));
                                //if button not null
                                if (Button) {
                                    //put button in pager in utility in the args object
                                    args.Utility.Pager[k] = Button;
                                    //set [style,class,attributes,properties]
                                    set_SCAPE(Button, buttonObject);
                                    //get nextButtonEvents
                                    var buttonEvents = ((mCheck.isObj.notEmpty(v.Events)) ? (v.Events) : (null));
                                    //set click event
                                    Button.onclick = function (evt) {
                                        //execute paging
                                        Paging(k, Pager[k], args);
                                        //if button events not null
                                        if (buttonEvents) {
                                            //get click event
                                            var buttonClick = ((mCheck.isFunc(buttonEvents.click)) ? (buttonEvents.click) : (null));
                                            //if button not null 
                                            if (buttonClick) {
                                                //execute button click
                                                buttonClick(evt);
                                            }
                                        }
                                    }
                                    //loop over given events to bind it to nextButton
                                    for (var evt in buttonEvents) {
                                        if (evt.toString().toLowerCase() != 'click') {
                                            mScript.getByInst(Button).Event.Bind({ Events: [evt], Function: buttonEvents[evt] });
                                        }
                                    }
                                }
                            }
                        }
                        else if (k.toLowerCase() == "pagescountlabel" || k.toLowerCase() == "rowscountlabel") {
                            //get label object
                            var labelObject = ((mCheck.isObj.notEmpty(v)) ? (v) : (null));
                            //if labelObject not null
                            if (labelObject) {
                                //get label dom object
                                var Label = ((mCheck.isStr.notEmpty(labelObject.ID)) ? (document.getElementById(labelObject.ID)) : (null));
                                //if label is not null
                                if (Label) {
                                    //put label in pager in utility in the args object
                                    args.Utility.Pager[k] = Label;
                                    //set [style,class,attributes,properties]
                                    set_SCAPE(Label, labelObject);
                                    //get nextButtonEvents
                                    var labelEvents = ((mCheck.isObj.notEmpty(v.Events)) ? (v.Events) : (null));
                                    //loop over given events to bind it to label
                                    for (var evt in labelEvents) {
                                        mScript.getByInst(Label).Event.Bind({ Events: [evt], Function: labelEvents[evt] });
                                    }
                                }
                            }
                        }
                        else if (k.toLowerCase() == 'currentpagetext' || k.toLowerCase() == 'rowcounttext') {
                            //get textbox object
                            var textObject = ((mCheck.isObj.notEmpty(v)) ? (v) : (null));
                            //if textObject not null
                            if (textObject) {
                                //get textbox dom object
                                var Text = ((mCheck.isStr.notEmpty(textObject.ID)) ? (document.getElementById(textObject.ID)) : (null));
                                //if Text is not null
                                if (Text) {
                                    //put text in pager in utility in the args object
                                    args.Utility.Pager[k] = Text;
                                    //set [style,class,attributes,properties]
                                    set_SCAPE(Text, textObject);
                                    //get textEvents
                                    var textEvents = ((mCheck.isObj.notEmpty(v.Events)) ? (v.Events) : (null));
                                    //set key press eve
                                    Text.onkeypress = function (evt) {
                                        //get Event
                                        var ev = mScript.getEvent(evt);
                                        //get charCode
                                        var cCode = mScript.Event.charCode(evt).Key;
                                        //if Key is Enter
                                        if (cCode == 13) {
                                            //execute paging
                                            const pageNo = Number(Text.value);
                                            if (pageNo > 0 && (pageNo - 1 < args.Utility.gridData.pagesCount))
                                                Paging(k, Pager[k], args);
                                            else
                                                Text.value = args.Utility.gridData.pageIndex + 1;
                                            return false;
                                        }
                                        //if text events not null
                                        if (textEvents) {
                                            //get click event
                                            var textKeyPress = ((mCheck.isFunc(textEvents.keypress)) ? (textEvents.keypress) : (null));
                                            //if button not null
                                            if (textKeyPress) {
                                                //execute button click
                                                return textKeyPress(evt);
                                            }
                                        }
                                        return true;
                                    }

                                    //if textEvents not null
                                    if (textEvents) {
                                        //loop over given events to bind it to TextBox
                                        for (var evt in textEvents) {
                                            if (evt.toString().toLowerCase() != 'keypress') {
                                                mScript.getByInst(Text).Event.Bind({ Events: [evt], Function: textEvents[evt] });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (k.toLowerCase() == "pagingNumbers") {
                            //get pagingNumbersObject
                            var pagingNumbersObject = ((mCheck.isObj.notEmpty(v)) ? (v) : (null));
                            //if pagingNumbersObject not null
                            if (pagingNumbersObject) {
                                //get containerObject
                                var containerObject = ((mCheck.isObj.notEmpty(pagingNumbersObject.Container)) ? (pagingNumbersObject.Container) : (null));
                                //get Container Dom Object
                                var Container = ((mCheck.isStr.notEmpty(containerObject.ID)) ? (document.getElementById(containerObject.ID)) : (null));
                                //if Container Exist
                                if (Container) {
                                    //set pagingNumbers to Utility 
                                    args.Utility.Pager.pagingNumbers = {};
                                    //set Container to pagingNumbers 
                                    args.Utility.Pager.pagingNumbers.Container = Container;
                                    //if containerObject not null
                                    if (containerObject) {
                                        //set [style,class,attributes,properties]
                                        set_SCAPE(Container, containerObject);
                                    }
                                    //get numberDivsCount
                                    var numberDivsCount = ((mCheck.isNum(pagingNumbersObject.numberDivsCount)) ? (pagingNumbersObject.numberDivsCount) : (3));
                                    //get Count
                                    var Count = ((args.Utility.gridData.pagesCount > numberDivsCount) ? (numberDivsCount) : (args.Utility.gridData.pagesCount));
                                    //set Count in pagingNumbers
                                    args.Utility.Pager.pagingNumbers.Count = Count;
                                    //get numberDivsObject
                                    var numberDivsObject = ((mCheck.isObj.notEmpty(pagingNumbersObject.numberDivs)) ? (pagingNumbersObject.numberDivs) : (null));
                                    //set numbersDiv to Container
                                    args.Utility.Pager.pagingNumbers.Container.numbersDiv = [];
                                    //loop over count to add numberDivs
                                    for (var n = 0; n < Count; n++) {
                                        //creat numberDiv
                                        var numberDiv = document.createElement('DIV');
                                        //set numberDiv HTML
                                        numberDiv.innerHTML = (n + 1);
                                        //set numberDiv Click Event
                                        numberDiv.onclick = function (evt) {
                                            if (numberDivsObject) {
                                                if (mCheck.isObj.notEmpty(numberDivsObject.Events)) {
                                                    if (mCheck.isFunc(numberDivsObject.Events['click'])) {
                                                        numberDivsObject.Events['click'](evt);
                                                    }
                                                }
                                            }
                                        }
                                        //Do Paging
                                        Paging(k, numberDivsObject, args, numberDiv);
                                        //add numberDiv Dom To Container
                                        Container.appendChild(numberDiv);
                                        //add numberDiv as an Element in Array in numbersDiv
                                        var numbersDivLength = args.Utility.Pager.pagingNumbers.Container.numbersDiv.length
                                        args.Utility.Pager.pagingNumbers.Container.numbersDiv[numbersDivLength] = numberDiv;
                                    }
                                    //if numberDivsObject not null
                                    if (numberDivsObject) {
                                        //set [style,class,attributes,properties]
                                        set_SCAPE(numberDiv, numberDivsObject, false);
                                        if (mCheck.isObj.notEmpty(numberDivsObject.Events)) {
                                            //loop over given events to bind it to numberDiv but not click event
                                            for (var evt in numberDivsObject.Events) {
                                                if (evt.toString().toLowerCase() != 'click') {
                                                    mScript.getByInst(numberDiv).Event.Bind({ Events: [evt], Function: numberDivsObject.Events[evt] });
                                                }
                                            }
                                        }
                                    }

                                }

                            }
                        }
                    })
                    //onPagerRenderComplete Event
                    if (args.Pager.onPagerRenderComplete) {
                        args.Pager.onPagerRenderComplete(args.Utility.Pager)
                    }
                    //setPagerData
                    setPagerData(args);
                    renderToolTip();
                    //return Pager Object in Utility
                    return args.Utility.Pager;
                }
            }
        }
    }
    return null;
};
//#EndRegion
function rerenderPager(Container, args) {
    var Pager = args.Pager;
    newContainer = document.createElement("div");
    newContainer.id = Pager.Container.ID;
    newContainer.className = "pagging_bx";
    newContainer.style.display = Container && Container.style ? Container.style.display : "block";
    newContainer.innerHTML = '<ul><li><input type="button" id="' + Pager.firstButton.ID + '" class="gradiant" value="الاول" /></li>'
        + '<li><input type="button" id="' + Pager.backButton.ID + '" class="gradiant" value="السابق" /></li>'
        + '<li><span id="' + Pager.pagesCountLabel.ID + '" class=""></span></li>'
        + '<li><input type="text" id="' + Pager.currentPageText.ID + '" class="" onpaste="return false;" ondrop="return false;"/></li>'
        + '<li><span id="' + Pager.rowsCountLabel.ID + '" class=""></span></li>'
        + '<li><input type="button" class="gradiant" id="' + Pager.nextButton.ID + '" value="التالي" /></li>'
        + '<li><input type="button" class="gradiant" id="' + Pager.lastButton.ID + '" value="الاخير" /></li></ul>';
    var tblCaption = document.createElement("caption");
    tblCaption.style = "caption-side:bottom";
    tblCaption.appendChild(newContainer);
    if (Container) {
        Container.parentNode.removeChild(Container);
    }
    var table = document.getElementById(args.Table.ID);
    table.appendChild(tblCaption);
    return tblCaption;
};
function renderToolTip() {
    var tooltip = document.createElement("div");
    tooltip.id = "tooltip";
    tooltip.className = "tooltip";
    tooltip.style.display = "none";

    var elem = document.getElementById("tooltip");
    if (elem) {
        elem.parentNode.removeChild(elem);
    }
    document.body.appendChild(tooltip);

    var div_title = document.createElement("div");
    div_title.id = "div_title";
    div_title.className = "mgrid_tooltip";
    div_title.style.display = "none";
    div_title.setAttribute("onmouseout", "div_title_MouseOut(this);")
    div_title.setAttribute("onmouseover", "div_title_MouseOver(this);")

    elem = document.getElementById("div_title");
    if (elem) {
        elem.parentNode.removeChild(elem);
    }
    document.body.appendChild(div_title);
};
//set_Empty_Div
//#Region
function set_Empty_Div(args) {
    //get Empty object
    var emptyObj = ((mCheck.isObj.notEmpty(args.Empty)) ? (args.Empty) : (null));
    //if Empty object not null
    if (emptyObj) {
        //get Empty ID from Object
        var emptyID = ((mCheck.isStr.notEmpty(emptyObj.ID)) ? (emptyObj.ID) : (null));
        //if Empty Id Exist
        if (emptyID) {
            //get empty dom by id
            var Empty = document.getElementById(emptyID);
            //if Empty dom not undefined
            if (Empty) {
                //set it on Utility
                args.Utility.Empty = Empty;
                //set SCAPE
                set_SCAPE(Empty, emptyObj, true);
                //get Text
                var Text = ((mCheck.isStr.notEmpty(emptyObj.Text)) ? (emptyObj.Text) : (null));
                //if text not null
                if (Text) {
                    //set Text to innerHTML
                    Empty.innerHTML = Text;
                }
            }
        }
        return emptyObj;
    }
    return null;
}
//#EndRegion
//set_Loader
//#Region
function set_Loader(args) {
    //get loader Object
    var loaderObject = ((mCheck.isObj.notEmpty(args.Loader)) ? (args.Loader) : (null));
    //if loaderObject no null
    if (loaderObject) {
        //get containerObject
        var containerObject = ((mCheck.isObj.notEmpty(loaderObject.Container)) ? (loaderObject.Container) : (null));
        //get Container Dom
        var Container = ((mCheck.isStr.notEmpty(containerObject.ID)) ? (document.getElementById(containerObject.ID)) : (null));
        //if Container Dom not null
        if (Container) {
            //set SCAPE
            set_SCAPE(Container, containerObject, true);
            //set Utility
            args.Utility.Loader = Container;

            //get Img DOM
            var Img = ((mCheck.isStr.notEmpty(loaderObject.ID)) ? (document.getElementById(loaderObject.ID)) : (null));
            //if Img Not null
            if (Img) {
                //set_SCAPE
                set_SCAPE(Img, loaderObject, true);
                //set Utility
                args.Utility.Loader.Img = Img;
            }
            //Hide Loader
            Container.style.display = 'none';
            return Img;
        }
    }
    return null;
}
//#EndRegion

//Paging
//#Region
function Paging(pagerKeyName, currentPagerObject, args, Element) {

    //get onBeforePaging
    if (mCheck.isFunc(args.Pager.onBeforePaging)) {
        args.Pager.onBeforePaging(pagerKeyName, currentPagerObject, args)
    }
    //get Current page Index
    var pIndex = Number(args.Utility.gridData.pageIndex);
    //get all data rows count
    var rsCount = Number(args.Utility.gridData.rowsCount);
    //get pagesCount
    var pagesCount = Number(args.Utility.gridData.pagesCount);
    //switch over pagerKeyNames
    switch (pagerKeyName.toLowerCase()) {
        case "nextbutton":
            pIndex += 1;
            break;
        case "backbutton":
            pIndex -= 1;
            break;
        case "firstbutton":
            pIndex = 0;
            break;
        case "pagingnumbers":
            pIndex = Number(Element.innerHTML) - 1;
            break;
        case "lastbutton":
            pIndex = (pagesCount - 1);
            break;
        case "currentpagetext":
            pIndex = ((mScript.getByIds(currentPagerObject.ID).Val().fTrim() == '') ? (0) : ((Number(mScript.getByIds(currentPagerObject.ID).Val()) - 1)));
            break;
        case "rowcounttext":
            args.Utility.gridData.pageRowCounts = Number(mScript.getByIds(currentPagerObject.ID).Val());
            break;
    }
    //set page index in utility
    args.Utility.gridData.pageIndex = ((pIndex < 0) ? (pIndex = Number(args.Utility.gridData.pageIndex)) : ((pIndex > (Number(args.Utility.gridData.pagesCount) - 1)) ? (pIndex = (args.Utility.gridData.pageIndex)) : (pIndex)));
    //controlPagingButtons
    controlPagingButtons(args);
    //alocateDataForServer
    var dataForServer = alocateDataForServer(args.Utility.gridData, args);
    //getData
    var dataFromServer = getData(dataForServer, args);
    //clearRows
    clearRows(args);
    //setRows
    set_Rows(args);
    //controlPagingButtons
    controlPagingButtons(args);
    //setPagerData
    setPagerData(args)
    //get onPaging
    if (mCheck.isFunc(args.Pager.onPaging)) {
        args.Pager.onPaging(pagerKeyName, currentPagerObject, args)
    }
}
//#EndRegion
//Sorting
//#Region
function Sorting(e, args) {
    if (e.Column.Name.fTrim() != args.Utility.gridData.sortColumn.fTrim()) {
        args.Utility.gridData.sortOrder = '';
        args.Utility.gridData.sortColumn = e.Column.Name;
    }
    switch (args.Utility.gridData.sortOrder.fTrim()) {
        case "":
            args.Utility.gridData.sortOrder = "ASC";

            break;
        case "ASC":
            args.Utility.gridData.sortOrder = "DESC";

            break;
        case "DESC":
            args.Utility.gridData.sortOrder = "ASC";
            break;
    }
    //set Sort Column
    args.Utility.gridData.sortColumn = e.Column.Name;
    //set pageIndex to 0
    args.Utility.gridData.pageIndex = (args.AllowScroll == null || args.AllowScroll == undefined || args.AllowScroll == false) ? (0) : (-9);
    //alocateDataForServer
    var dataForServer = alocateDataForServer(args.Utility.gridData, args);
    //dataFromServer
    var dataFromServer = getData(dataForServer, args);

    //Related to Sorting Notification Arrows
    if (args.sortingNotificator) {
        var Columns = args.Utility.Table.Header.Row.Columns;

        for (var c in Columns) {
            if (Columns[c].spanImg && (Columns[e.Column.Name].spanImg != Columns[c].spanImg))
                Columns[c].spanImg.Img.src = '../../styles/Default/Images/sortUpDownArrow.png';
        }

        Columns[e.Column.Name].spanImg.Img.src = ((args.Utility.gridData.sortOrder == 'ASC') ? ('../../styles/Default/Images/sortUpArrow.png') : ('../../styles/Default/Images/sortDownArrow.png'));
    }

    //clearRows
    clearRows(args);
    //set_Rows
    set_Rows(args);
    //controlPagingButtons
    controlPagingButtons(args);
    //setPagerData
    setPagerData(args)
    //onSorting
    if (args.onSorting) {
        args.onSorting(e);
    }
}
//#EndRegion
//Reload
//#Region
function Reload(obj, args) {
    //obj
    obj = ((obj) ? (obj) : ({}));
    //get Utility
    var Utility = ((mCheck.isObj.notEmpty(args.Utility)) ? (args.Utility) : (null));
    //if utility is set
    if (Utility) {
        //get gridData
        var gridData = ((mCheck.isObj.notEmpty(Utility.gridData)) ? (Utility.gridData) : (null));
        //set gridData pageIndex
        //if Grid Scrollabale pageIndex = 0
        gridData.pageIndex = (args.AllowScroll == null || args.AllowScroll == undefined || args.AllowScroll == false) ? ((obj.pageIndex) ? (obj.pageIndex) : (((args.pageIndex) ? (args.pageIndex) : (0)))) : -9;
        //set gridData pageRowCounts
        gridData.pageRowCounts = ((obj.pageRowCounts) ? (obj.pageRowCounts) : (((args.pageRowCounts) ? (args.pageRowCounts) : (10))));
        //set gridData sortColumn
        gridData.sortColumn = ((obj.sortColumn) ? (obj.sortColumn) : (((args.sortColumn) ? (args.sortColumn) : (''))));
        //set gridData sortOrder
        gridData.sortOrder = ((obj.sortOrder) ? (obj.sortOrder) : (((args.sortOrder) ? (args.sortOrder) : (''))));

        if (args.sortingNotificator) {
            var Columns = args.Utility.Table.Header.Row.Columns;

            if (Columns[args.sortColumn]) {
                for (var c in Columns) {
                    if (Columns[c].spanImg && ((args.sortColumn) ? ((Columns[args.sortColumn].spanImg != Columns[c].spanImg)) : (true)))
                        Columns[c].spanImg.Img.src = '../../styles/Default/Images/sortUpDownArrow.png';
                }
            }
            if (Columns[args.sortColumn]) {
                if (args.sortColumn)
                    Columns[args.sortColumn].spanImg.Img.src = ((args.Utility.gridData.sortOrder == 'ASC') ? ('../../styles/Default/Images/sortUpArrow.png') : ('../../styles/Default/Images/sortDownArrow.png'));
            }
        }


        //remove Basic gridData From Object
        if (obj.pageIndex)
            delete obj.pageIndex
        if (obj.pageRowCounts)
            delete obj.pageRowCounts
        if (obj.sortColumn)
            delete obj.sortColumn
        if (obj.sortOrder)
            delete obj.sortOrder

        //set gridData searchObject
        gridData.searchObject = ((mCheck.isObj.notEmpty(obj)) ? (obj) : (((mCheck.isObj.notEmpty(args.searchObject)) ? (args.searchObject) : (null))));
        //dataToServer
        var dataToServer = alocateDataForServer(gridData, args);
        //dataFromServer
        var dataFromServer = getData(dataToServer, args);
        //if dataFromServer not null
        if (dataFromServer) {
            //if rowsCount > 0 
            rerenderEmpty(args);
            if (dataFromServer.rowsCount > 0) {
                //Show Grid
                showGrid(args, true);
                //Hide Empty
                showEmpty(args, false);
            }
            else {
                //Show Grid
                showGrid(args, false);
                //get Empty
                var Empty = set_Empty_Div(args);
                //if empty not null
                if (Empty) {
                    //Show Empty
                    showEmpty(args, true);
                }
            }

            //clearRows
            clearRows(args);
            //setRows
            set_Rows(args);
            //controlPagingButtons
            controlPagingButtons(args);
            //setPagerData
            setPagerData(args);
        }
    }
}
//#EndRegion
//removeGridRow
//#Region
function removeGridRow(row, args) {

    if (row) {
        if (args) {
            if (!(args.Scrolling)) {
                if (args.Utility.gridData.pageIndex == 0) {
                    Reload(args.Utility.gridData.searchObject, args);
                }
                else {
                    var pIndx = args.Utility.gridData.pageIndex;
                    var sObj = ((args.Utility.gridData.searchObject) ? (args.Utility.gridData.searchObject) : (null));
                    if (mScript.getByInst(args.Utility.Table).getByTagNames('TR').Count <= 2) {
                        if (sObj) {
                            sObj.pageIndex = (Number(pIndx) - 1);
                        }
                        else {
                            sObj = { pageIndex: (Number(pIndx) - 1) }
                        }
                    }
                    Reload(sObj, args);
                }
            }
            else {
                Reload(args.Utility.gridData.searchObject, args);
            }
        }
    }
}
//#EndRegion

//mGridInitialize
//#Region
function mGridInitialize(args) {
    //Hide Grid
    showGrid(args, false);
    //Hide Empty
    showEmpty(args, false);
    //alocate Data For Server
    var dataObjectToServer = alocateDataForServer(args, args);
    //if objForServer is not null
    if (dataObjectToServer) {
        //Initiate Ajax Call To Get Data
        var objFromServer = getData(dataObjectToServer, args);
        //if objFromServer is not null
        if (objFromServer) {
            rerenderEmpty(args);
            if (objFromServer.rowsCount > 0) {
                //Show Grid
                showGrid(args, true);
                //Hide Empty
                showEmpty(args, false);
            }
            else {
                //Show Grid
                showGrid(args, false);
                //get Empty
                var Empty = set_Empty_Div(args);
                //if empty not null
                if (Empty) {

                    //Show Empty
                    showEmpty(args, true);
                }
            }
            //initiate grid
            setGridSectors(args);
            //controlPagingButtons
            controlPagingButtons(args);
        }
    }
}
//#EndRegion      
//setGridSectors
//#Region
function setGridSectors(args) {

    //if args is given
    if (mCheck.isObj.notEmpty(args)) {
        //set [Table / Caption] 
        var table = set_Table(args);
        // if table and caption is set
        if (table != null) {
            //if Columns is given in the args
            if (mCheck.isAry.notEmpty(args.Columns)) {
                //set Header Row
                var trHeader = set_Headers(args);
                //if header is set
                if (trHeader != null) {
                    //set Rows
                    var trsBodyAry = set_Rows(args);
                    //if rows is set and grid Not Scrollable Get Pager
                    if (trsBodyAry && (args.AllowScroll == null || args.AllowScroll == undefined || args.AllowScroll == false)) {
                        //set Pager [Data]
                        var pagerSet = set_Pager(args);
                        //if pager is set
                        if (pagerSet) {
                            //controlPagingButtons
                            controlPagingButtons(args);
                            //if onGridComplete event not null
                            if (mCheck.isFunc(args.onGridComplete)) {
                                //execute the function
                                args.onGridComplete(args.Utility);
                            }
                        }
                        else {
                            //if onGridComplete event not null
                            if (mCheck.isFunc(args.onGridComplete)) {
                                //execute the function
                                args.onGridComplete(args.Utility);
                            }
                        }
                    }
                    else {
                        //set Pager [Data]
                        /*Elgendy Begin Scroll*/
                        if (args.AllowScroll == null || args.AllowScroll == undefined || args.AllowScroll == false) {
                            var pagerSet = set_Pager(args);
                        }
                        //remove Pager if Grid Scrollable
                        else {

                            var Pager = ((mCheck.isObj.notEmpty(args.Pager)) ? (args.Pager) : (null));
                            //if page object not null
                            if (Pager) {
                                //get pager Container
                                var containerObj = ((mCheck.isObj.notEmpty(Pager.Container)) ? (Pager.Container) : (null));
                                if (containerObj) {
                                    //get container Dom
                                    var Container = ((mCheck.isStr.notEmpty(containerObj.ID)) ? (document.getElementById(containerObj.ID)) : (undefined));
                                    //if container is not undefined
                                    if (Container) {
                                        Container.remove();
                                    }
                                }
                            }
                        }
                        /*Elgendy END Scroll*/
                        //if onGridComplete event not null
                        if (mCheck.isFunc(args.onGridComplete)) {
                            //execute the function
                            args.onGridComplete(args.Utility);
                        }
                    }
                }
            }
        }
        //set Empty 
        var Empty = set_Empty_Div(args);
        //set Loader
        var Loader = set_Loader(args);
    }
}
//#EndRegion

//mGrid Helper 
/* Example Created by Mohamed Elgendy
 Columns: [
            GridHelper.getGridColumnCheckBoxObj("", "", "INCOME_No"),//CheckBox
            GridHelper.getGridColumnObj('INCOME_NO', "رقم الوارد", false, 80, true),
            GridHelper.getGridColumnObj('CREATED_IN', "تاريخ الوارد", false, 100, true),
            GridHelper.getGridColumnObj('ARGUMENT_ID', "رقم الطلب", false, 80, true),
            GridHelper.getGridColumnObj('ARGUMENT_ID', "رقم الطلب", true, 80, true, { clckbl_ToolTpMthd: "arc_argument_archive.show_Details_Hgg" }),//Clickable Grid
            GridHelper.getGridColumnObj('NAT_NO', "رقم الهوية", false, 100, true),
            GridHelper.getGridColumnObj('CITIZEN_NAME', "إسم المواطن", true, 150, true, { clckbl_ToolTpMthd: "arc_argument_archive.show_Details_Hgg" }),//Clickable Grid
            GridHelper.getGridColumnObj('CURRENT_EMP', "لدى", true, 150, true, { clckbl_ToolTpMthd: "arc_argument_archive.show_Details_Hgg" }),//Clickable Grid
        ],
*/
GridHelper = {
    /*onCellComplete*/
    getDivCell: function (td, text, row, allowToolTip, width, height, additionalObj) {
        var div = document.createElement('DIV');
        div.innerHTML = text;
        if (allowToolTip && text) {
            if (additionalObj && additionalObj.clckbl_ToolTpMthd)
                div.setAttribute('onmouseover', 'td_MouseOver(event,"' + additionalObj.clckbl_ToolTpMthd + '(\'' + row.ROW_NUM + '\',\'' + row + '\')");');
            else
                div.setAttribute('onmouseover', 'td_MouseOver(event);');
            div.setAttribute('onmouseout', 'td_MouseOut(event);');
            div.setAttribute('full_title', text);
        }
        div.style.overflow = 'hidden';
        div.style.width = width + ((width && !width.toString().endsWith("px")) ? "px" : "");
        div.style.height = height + ((height && !height.toString().endsWith("px")) ? "px" : "");
        td.innerHTML = '';
        td.appendChild(div)
        return td;
    },
    //onCellComplete Check Box
    getCheckBoxCell: function (td, text, row, UniqueID, additionalObj) {
        var chkbox = document.createElement('input');
        chkbox.type = "checkbox";
        chkbox.id = "cb_Select_" + UniqueID;
        chkbox.name = "cb_Select";
        chkbox.setAttribute('nav', '0');
        chkbox.Row = row;
        if (additionalObj && additionalObj.check_OnChange)
            chkbox.onchange = additionalObj.check_OnChange;
        td.appendChild(chkbox);
    },

    //Get All Obj of the Column
    getGridColumnObj: function (ColumnName, Header_Text, allowToolTip, Width, Height, IsSort, additionalObj) {
        var Columnobj = {
            Name: ColumnName,
            Header: { Text: Header_Text },
            Width: Width + ((Width && !Width.toString().endsWith("px")) ? "px" : ""),
            Cell: {
                onCellComplete: function (td, text, row) {
                    GridHelper.getDivCell(td, text, row, allowToolTip, Width, Height, additionalObj);
                }
            },
            Sort: IsSort
        }
        return Columnobj;
    },
    getGridColumnCheckBoxObj: function (Header_Text, Width, UniqeID_Column, additionalObj) {
        var Columnobj = {
            Name: "cb_Select",
            Header: { Text: Header_Text ? Header_Text : "" },
            Width: Width + ((Width && !Width.toString().endsWith("px")) ? "px" : ""),
            Cell: {
                onCellComplete: function (td, text, row) {
                    GridHelper.getCheckBoxCell(td, text, row, row[UniqeID_Column], additionalObj);
                }
            }
        }
        return Columnobj;
    },
    //Show Hid Column
    ShowHideGridColumn: function (tbl_GridObj, ColumnNames, IsShow, showInCollapseDiv) {
        if (tbl_GridObj.Utility.Table.Body) {
            var ColumnNamesAry = (ColumnNames ? (Array.isArray(ColumnNames) ? ColumnNames : [ColumnNames]) : null);
            for (var x = 0; x < ColumnNamesAry.length; x++) {
                tbl_GridObj.Utility.Table.Header.Row.Columns[ColumnNamesAry[x]].style.display = IsShow ? "" : "none";
                for (var i = 0; i < tbl_GridObj.Utility.Table.Body.Rows.length; i++) {
                    if (tbl_GridObj.hideOverFlow) {
                        var el = document.getElementById(tbl_GridObj.Table.ID + '_' + ColumnNamesAry[x] + '_lichild_' + i);
                        if (el && showInCollapseDiv)
                            el.style.display = '';
                        else
                            el.style.display = 'none';
                    }
                    tbl_GridObj.Utility.Table.Body.Rows[i].Columns[ColumnNamesAry[x]].style.display = IsShow ? "" : "none";
                }
            }
        }
    },
    ChangeGridColumnName: function (tbl_GridObj, ColumnNames, NewColumnText) {
        var ColumnNamesAry = (ColumnNames ? (Array.isArray(ColumnNames) ? ColumnNames : [ColumnNames]) : null);
        var NewColumnTextAry = (NewColumnText ? (Array.isArray(NewColumnText) ? NewColumnText : [NewColumnText]) : null);
        for (var x = 0; x < ColumnNamesAry.length; x++) {
            //    tbl_GridObj.Utility.Table.Header.Row.Columns[ColumnNamesAry[x]].getElementById("spn_Mgrid_h_" + ColumnNamesAry[x]).innerHTML = NewColumnTextAry[x];
            if (document.getElementById("spn_Mgrid_h_" + ColumnNamesAry[x]))
                document.getElementById("spn_Mgrid_h_" + ColumnNamesAry[x]).innerHTML = NewColumnTextAry[x];
            else
                tbl_GridObj.Utility.Table.Header.Row.Columns[ColumnNamesAry[x]].innerHTML = NewColumnTextAry[x];
            for (var rowindx = 0; rowindx < tbl_GridObj.Utility.Table.Body.Rows.length; rowindx++) {
                var title = document.getElementById(tbl_GridObj.Table.ID + '_' + ColumnNamesAry[x] + '_Title_lichild_' + rowindx);
                if (!title)
                    break;
                document.getElementById(tbl_GridObj.Table.ID + '_' + ColumnNamesAry[x] + '_Title_lichild_' + rowindx).innerHTML = NewColumnTextAry[x];
            }
        }
    },
    // title > title of header cell   ,   columnsCount  > number of columns in the table   ,   divId > div id where the control will appear
    // data parameter >  "Array of Objects" OR "Array of Strings"
    // columnName parameter > column name in case of data parameter is "Array of Objects" OR empty string in case of data parameter is "Array of Strings"
    showColumnAsTable: function (title, columnsCount, data, columnName, divId) {
        var tableContent = '<table class="gridScroll grid_newship"><thead><tr><th colspan="' + columnsCount + '"><span>' + title + '</span></th></tr></thead><tbody>';
        var j = 0, cellText = "";
        var rowsLen = Math.floor(data.length / columnsCount) + 1;
        for (var i = 0; i < rowsLen; i++) {
            tableContent += "<tr>";
            for (var c = 0; c < columnsCount; c++) {
                cellText = data[j] ? (columnName ? data[j][columnName] : data[j]) : "";
                tableContent += "<td><div>" + cellText + "</div></td>"
                j += 1;
            }
            tableContent += "</tr>";
        }
        tableContent += '</tbody></table>';
        document.getElementById(divId).innerHTML = tableContent;
    }
}