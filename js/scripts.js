$(document).ready(
    function() {
        // zmienne globalne
        var miejsceStartowe = {
            wojewodztwo : "",
            miasto : "",
            nazwaUlicy : "",
            numerDomu : "",
            dlugoscGeograficzna : "",
            szerokoscGeograficzna : ""
        };
        
        var miejsceDoceloweLista = [];
        
        var waypoint0Ajax = {};
        var waypoint1Ajax = {};
        var modeAjax = {};
        
        // oblsuga zdarzen interfejsu uzytkownika
        $("#btnZnajdzDlugoscISzerokosc").on("click", function(event) {
            event.stopPropagation();
            event.preventDefault();
            
            // dane wymagane dla zadania Ajax :
            var identyfikatorAplikacji = $("#identyfikatorAplikacji").val();
            var kodAplikacji = $("#kodAplikacji").val();
            
            // paramtery do zapytania :
            var inputWojewodztwo = $("#inputWojewodztwo").val();
            var inputMiasto = $("#inputMiasto").val();
            var inputUlicaNazwa = $("#inputUlicaNazwa").val();
            var inputNrDomu = $("#inputNrDomu").val();

            var emptyFields = "";
            if (inputWojewodztwo == null || inputWojewodztwo == "") {
                emptyFields = emptyFields + " wojewodztwo, ";
            }
            if (inputMiasto == null || inputMiasto == "") {
                emptyFields = emptyFields + " miasto, ";
            }
            if (inputUlicaNazwa == null || inputUlicaNazwa == "") {
                emptyFields = emptyFields + " nazwa ulicy, ";  
            }
            if (inputNrDomu == null || inputNrDomu == "") {
                emptyFields = emptyFields + " numer domu, ";
            }
            if (identyfikatorAplikacji == null || identyfikatorAplikacji == "") {
                emptyFields = emptyFields + " identyfikator aplikacji, ";
            }
            if (kodAplikacji == null || kodAplikacji == "") {
                emptyFields = emptyFields + " kod aplikacji ";
            }
            if (emptyFields != "") {
                alert("Te pola sa obowiazkowe : " + emptyFields + ".");
                return;
            }
            
            // usluga ze strony 'developer.here.com'
//            var urlCreated = "https://geocoder.api.here.com/6.2/geocode.json?app_id="+identyfikatorAplikacji+"&app_code="+kodAplikacji+"&country=pl&state="+inputWojewodztwo+"&city="+inputMiasto+"&street="+inputUlicaNazwa+"&housenumber="+inputNrDomu;
            
            var urlCreated = "https://geocoder.api.here.com/6.2/geocode.json";
            
            var jqxhr = $.ajax({
                url : urlCreated, 
                dataType : "json", 
                method : "GET",
                data: {
                    country: 'pl',
                    state: inputWojewodztwo,
                    city: inputMiasto,
                    street: inputUlicaNazwa,
                    housenumber: inputNrDomu,
                    app_id: identyfikatorAplikacji,
                    app_code: kodAplikacji
                }
            })
            .done(function(data, textStatus, jqXHR) {
                // wyciagnij dane z zadania Ajax i wstaw do wylaczonych pol tekstowych :
                var geocodeAjaxResponse = data;
                
                var inputZnalezionaSzerGeogr = "";
                var inputZnalezionaDlGeogr = "";
                
                var trafnoscDopasowaniaAdresu = "";
                var jakoscDopasowania = "";
                
                if (geocodeAjaxResponse.textStatus = 'success') {
                    inputZnalezionaSzerGeogr = geocodeAjaxResponse.Response.View['0'].Result['0'].Location.NavigationPosition['0'].Latitude;
                    inputZnalezionaDlGeogr = geocodeAjaxResponse.Response.View['0'].Result['0'].Location.NavigationPosition['0'].Longitude;
                    
                    trafnoscDopasowaniaAdresu = geocodeAjaxResponse.Response.View['0'].Result['0'].Relevance;
                    jakoscDopasowania = geocodeAjaxResponse.Response.View['0'].Result['0'].MatchType;
                }
                
                $("#inputZnalezionaSzerGeogr").val(inputZnalezionaSzerGeogr);
                $("#inputZnalezionaDlGeogr").val(inputZnalezionaDlGeogr);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                alert( "error -- " + textStatus );
            });
        });
        
        $("#btnMiejscaWPoblizu").on("click", function(event) {
            event.stopPropagation(); 
            event.preventDefault();
            
            // tabela HTML do wypelnienia :
            var tableBodyMiejscaWPoblizu = $("#tableMiejscaWPoblizu #tableBodyMiejscaWPoblizu");
            $(tableBodyMiejscaWPoblizu).empty();
            
            miejsceDoceloweLista.length = 0;
            
            // elementy z trzeciej zakladki :
            $("#opisTrasy").html("");
            $("#miejsceStartowe").html("");
            $("#tabelaJakJechac").empty();
            
            // dane wymagane dla zadania Ajax :
            var identyfikatorAplikacji = $("#identyfikatorAplikacji").val();
            var kodAplikacji = $("#kodAplikacji").val();
            
            // paramtery do zapytania :
            var inputZnalezionaSzerGeogr = $("#inputZnalezionaSzerGeogr").val();
            var inputZnalezionaDlGeogr = $("#inputZnalezionaDlGeogr").val();
            // tablica napisow (lista wielokrotnego wyboru)
            var selectTypPoszukiwanychObiektow = $("#selectTypPoszukiwanychObiektow").val();
            var listaPoszukiwanychObiektowJakoNapis = "";
            $(selectTypPoszukiwanychObiektow).each(function(index, element) {
                listaPoszukiwanychObiektowJakoNapis += element + ",";
            });
            // liczba
            var obszarPoszukiwan = $("#obszarPoszukiwan").val();
            
            // usluga ze strony 'developer.here.com'
//            var urlCreated = "https://places.demo.api.here.com/places/v1/browse?in="+inputZnalezionaSzerGeogr+","+inputZnalezionaDlGeogr+";r="+obszarPoszukiwan+"&cat="+listaPoszukiwanychObiektowJakoNapis+"&app_id="+identyfikatorAplikacji+"&app_code="+kodAplikacji;
            
            var urlCreated = "https://places.demo.api.here.com/places/v1/browse";
            
            var jqxhr = $.ajax({
                url : urlCreated, 
                dataType : "json", 
                method : "GET",
                data : {
                    in: inputZnalezionaSzerGeogr+","+inputZnalezionaDlGeogr+";r="+obszarPoszukiwan,
                    cat: listaPoszukiwanychObiektowJakoNapis,
                    app_id: identyfikatorAplikacji,
                    app_code: kodAplikacji
                }
            })
            .done(function(data, textStatus, jqXHR) {
                // wyciagnij dane z zadania Ajax i wypelnij tabele 'tableBodyMiejscaWPoblizu' :
                
                var placesBrowseAjaxResponse = data;
                if (textStatus == 'success') {
                    $(placesBrowseAjaxResponse.results.items).each(function(index, element) {
                        
                        var miejsceDoceloweLokalnie = {};
                        
                        var komorkaKolejnyNumer = $("<td></td>");
                        var kolejnyNumerLicznik = index;
                        komorkaKolejnyNumer.text(++kolejnyNumerLicznik);
                        komorkaKolejnyNumer.addClass('kolejny-numer');
                        miejsceDoceloweLokalnie.kolejnyNumerLicznik = kolejnyNumerLicznik;
                        
                        var nazwa = element.title;
                        var komorkaNazwa = $("<td></td>");
                        komorkaNazwa.text(nazwa);
                        miejsceDoceloweLokalnie.nazwa = nazwa;
                        
                        var adres = element.vicinity;
                        var komorkaAdres = $("<td></td>");
                        komorkaAdres.text(adres);
                        miejsceDoceloweLokalnie.adres = adres;
                        
                        var odleglosc = element.distance;
                        var komorkaOdleglosc = $("<td></td>");
                        komorkaOdleglosc.text(odleglosc);
                        miejsceDoceloweLokalnie.odleglosc = odleglosc;
                        
                        var nazwaKategoriiMiejsca = element.category.title;
                        var komorkaNazwaKategoriiMiejsca = $("<td></td>");
                        komorkaNazwaKategoriiMiejsca.text(nazwaKategoriiMiejsca);
                        miejsceDoceloweLokalnie.nazwaKategoriiMiejsca = nazwaKategoriiMiejsca;
                        
                        var idKategoriiMiejsca = element.category.id;
                        var komorkaIdKategoriiMiejsca = $("<td></td>");
                        komorkaIdKategoriiMiejsca.text(idKategoriiMiejsca);
                        miejsceDoceloweLokalnie.idKategoriiMiejsca = idKategoriiMiejsca;
                        
                        var szerokoscGeograficzna = element.position[0];
                        var komorkaSzerokoscGeograficzna = $("<td></td>");
                        komorkaSzerokoscGeograficzna.text(szerokoscGeograficzna);
                        miejsceDoceloweLokalnie.szerokoscGeograficzna = szerokoscGeograficzna;
                        
                        var dlugoscGeograficzna = element.position[1];
                        var komorkaDlugoscGeograficzna = $("<td></td>");
                        komorkaDlugoscGeograficzna.text(dlugoscGeograficzna);
                        miejsceDoceloweLokalnie.dlugoscGeograficzna = dlugoscGeograficzna;
                        
                        miejsceDoceloweLista.push(miejsceDoceloweLokalnie);
                        
                        var tableRow = $("<tr></tr>");
                        tableRow.append(komorkaKolejnyNumer);
                        tableRow.append(komorkaNazwa);
                        tableRow.append(komorkaAdres);
                        tableRow.append(komorkaOdleglosc);
                        
                        tableRow.append(komorkaNazwaKategoriiMiejsca);
                        tableRow.append(komorkaIdKategoriiMiejsca);
  
                        tableRow.append(komorkaDlugoscGeograficzna);
                        tableRow.append(komorkaSzerokoscGeograficzna);
                        
                        $(tableBodyMiejscaWPoblizu).append(tableRow);
                    });
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                alert( "error -- " + textStatus );
            });
        });
        
        $("#btnPokazTrase").on("click", function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // dane wymagane dla zadania Ajax :
            var identyfikatorAplikacji = $("#identyfikatorAplikacji").val();
            var kodAplikacji = $("#kodAplikacji").val();
            
            var srodekLokomocji = $("select[name='srodekLokomocji'] option:checked").val();
            
            var typTrasy = $("select[name='typTrasy'] option:checked").val();
            
            if (srodekLokomocji == 'none' || typTrasy == 'none') {
                alert("Pola 'Środek lokomocji' i 'Typ trasy' nie zostaly wybrane.");
                return false;    
            }
            
            if ($("input[type='radio'][name='znalezioneMiejscaRadio']:checked").length == 0) {
                alert("Nie wybrano miejsca docelowego.");
                return false;
            }
            
            var miejscePoczatkowe = miejsceStartowe;
            var dlugGeogrStart = miejscePoczatkowe.dlugoscGeograficzna
            var szerkGeogrStart = miejscePoczatkowe.szerokoscGeograficzna
            
            var wybraneMiejsceDocelowe = $("input[type='radio'][name='znalezioneMiejscaRadio']:checked");
            var doRozparsowaniaDlugISzerGeogr = wybraneMiejsceDocelowe.val();
            
            var dlugGeogrKoniec = doRozparsowaniaDlugISzerGeogr.split(",")[0];
            var szerkGeogrKoniec= doRozparsowaniaDlugISzerGeogr.split(",")[1];
            
            var urlCreated = "https://route.api.here.com/routing/7.2/calculateroute.json";
            
            waypoint0Ajax = szerkGeogrStart+","+dlugGeogrStart;
            waypoint1Ajax = szerkGeogrKoniec+","+dlugGeogrKoniec;
            modeAjax = typTrasy + ";" + srodekLokomocji +";"+ "traffic:enabled";

            var jqxhr = $.ajax({
                url : urlCreated, 
                dataType : "json", 
                method : "GET",
                data : {
                    waypoint0: waypoint0Ajax,
                    waypoint1: waypoint1Ajax,
                    mode: modeAjax,
                    routeattributes: 'sh',
                    maneuverattributes: 'di,sh',
                    departure: 'now',
                    language: 'pl-pl',
                    app_id: identyfikatorAplikacji,
                    app_code: kodAplikacji
                }
            })
            .done(function(data, textStatus, jqXHR) {
                var znalezioneTrasyAjaxResponse = data;
                
                var opisTrasy = znalezioneTrasyAjaxResponse.response.route['0'].summary.text;
                $("#opisTrasy").html(opisTrasy);
                
                var miejsceStartowe = znalezioneTrasyAjaxResponse.response.route['0'].leg['0'].start.label;
                $("#miejsceStartowe").html(miejsceStartowe);
                
                var tabelaJakJechac = $("#tabelaJakJechac");
                tabelaJakJechac.empty();
                
                $(znalezioneTrasyAjaxResponse.response.route['0'].leg['0'].maneuver).each(function(index, element) {
                    var wierszTabeli = $("<tr></tr>");
                    
                    var komorkaTabeli = $("<td></td>");
                    var kolejnyNumer = index;
                    komorkaTabeli.text(++kolejnyNumer);
                    komorkaTabeli.addClass('kolejny-numer');
                    wierszTabeli.append(komorkaTabeli);
                    
                    komorkaTabeli = $("<td></td>");
                    komorkaTabeli.html(element.instruction);
                    wierszTabeli.append(komorkaTabeli);
                
                    tabelaJakJechac.append(wierszTabeli);
                });
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                alert( "error -- " + textStatus );
            });
        });
        
        $("#btnPokazTraseNaMapie").on("click", function(event) {
            // kompletny URL dla czwartej zakladki :
            // https://route.api.here.com/routing/7.2/calculateroute.json?waypoint0=53.03044,18.67614&waypoint1=53.02614,18.66569&mode=balanced;bicycle;traffic:enabled&language=pl-pl&departure=now&app_id=T5XPHA90Llr2oEE6m5US&app_code=doM4_nvz2QpCW00GRK5gxg&representation=display&routeattributes=waypoints,summary,shape,legs&maneuverattributes=direction,action
            
            event.preventDefault();
            event.stopPropagation();
            
            var urlCreated = "https://route.api.here.com/routing/7.2/calculateroute.json";
            
            // dane wymagane dla zadania Ajax :
            var identyfikatorAplikacji = $("#identyfikatorAplikacji").val();
            var kodAplikacji = $("#kodAplikacji").val();
            
            var jqxhr = $.ajax({
                url : urlCreated, 
                dataType : "json", 
                method : "GET",
                data : {
                    waypoint0: waypoint0Ajax,
                    waypoint1: waypoint1Ajax,
                    mode: modeAjax,
                    representation: 'display',
                    routeattributes: 'waypoints,summary,shape,legs',
                    maneuverattributes: 'direction,action',
                    departure: 'now',
                    language: 'pl-pl',
                    app_id: identyfikatorAplikacji,
                    app_code: kodAplikacji
                }
            })
            .done(function(data, textStatus, jqXHR) {
                var route = data.response.route[0];
                
                // dane wymagane dla zadania Ajax :
                var identyfikatorAplikacji = $("#identyfikatorAplikacji").val();
                var kodAplikacji = $("#kodAplikacji").val();
                
                /**
                 * Boilerplate map initialization code starts below:
                 */

                // set up containers for the map  + panel
                // var mapContainer = document.getElementById('map');
                var mapContainer = $("#map");
                // var routeInstructionsContainer = document.getElementById('panel');
                var routeInstructionsContainer = $("#panel");
                
                // $(mapContainer).html("");
                mapContainer.html("");
                // $(routeInstructionsContainer).html("");
                routeInstructionsContainer.html("");


                //Step 1: initialize communication with the platform
                var platform = new H.service.Platform({
                    app_id: identyfikatorAplikacji,
                    app_code: kodAplikacji,
                    useHTTPS: true
                });
                var pixelRatio = window.devicePixelRatio || 1;
                var defaultLayers = platform.createDefaultLayers({
                    tileSize: pixelRatio === 1 ? 256 : 512,
                    ppi: pixelRatio === 1 ? undefined : 320
                });
                
                var inputZnalezionaSzerGeogr = $("#inputZnalezionaSzerGeogr").val();
                var inputZnalezionaDlGeogr = $("#inputZnalezionaDlGeogr").val();
                //Step 2: initialize a map - this map is centered over something
                var map = new H.Map(mapContainer.get(0),
                    defaultLayers.normal.map, {
                        center: {
                            lat: inputZnalezionaSzerGeogr,
                            lng: inputZnalezionaDlGeogr
                        },
                        zoom: 13,
                        pixelRatio: pixelRatio
                    }
                );
                
                //Step 3: make the map interactive
                // MapEvents enables the event system
                // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
                var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
                
                // Create the default UI components
                var ui = H.ui.UI.createDefault(map, defaultLayers);
                // Hold a reference to any infobubble opened
                var bubble;
                
                addRouteShapeToMap(route, map);
                addManueversToMap(route, map, ui, bubble);
                addWaypointsToPanel(route.waypoint, routeInstructionsContainer);
                addManueversToPanel(route, routeInstructionsContainer);
                addSummaryToPanel(route.summary, routeInstructionsContainer);
                // ..
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                alert( "error -- " + textStatus );
            });
        });
        
        $("#tabsGlownaZakladka a[data-toggle='tab']").on("show.bs.tab", function(event) {
            // druga zakladka
            if (event.target.text == "Ciekawe miejsca w pobliżu") {
                var inputZnalezionaSzerGeogr = $("#inputZnalezionaSzerGeogr").val();
                var inputZnalezionaDlGeogr = $("#inputZnalezionaDlGeogr").val();
                if (inputZnalezionaSzerGeogr == null || inputZnalezionaSzerGeogr == "" || inputZnalezionaDlGeogr == null || inputZnalezionaDlGeogr == "") {
                    // pojawi sie komunikat, ale zakladka nie stanie sie aktywna
                    alert("Wypełnij szerkość i długość geograficzną.");
                    return false;
                } else {
                    // kopiuje wartosci z pierwszej zakladki do drugiej
                    $("#inputWojewodztwoSecondTab").val($("#inputWojewodztwo").val());
                    $("#inputMiastoSecondTab").val($("#inputMiasto").val());
                    $("#inputNazwaUlicySecondTab").val($("#inputUlicaNazwa").val());
                    $("#inputNumerDomuSecondTab").val($("#inputNrDomu").val());
                    
                    $("#inputSzerokoscGeograficznaSecondTab").val(inputZnalezionaSzerGeogr);
                    $("#inputDlugoscGeograficznaSecondTab").val(inputZnalezionaDlGeogr);
                }
            // trzecia zakladka
            } else if (event.target.text == "Dostępne trasy ze znalezionego miejsca") {
                if (miejsceDoceloweLista.length == 0) {
                    alert("Lista z miejscami w pobliżu jest pusta.");
                    return false;
                }
                
                miejsceStartowe.wojewodztwo = $("#inputWojewodztwoSecondTab").val();
                miejsceStartowe.miasto = $("#inputMiastoSecondTab").val();
                miejsceStartowe.nazwaUlicy = $("#inputNazwaUlicySecondTab").val();
                miejsceStartowe.numerDomu = $("#inputNumerDomuSecondTab").val();
                miejsceStartowe.dlugoscGeograficzna = $("#inputDlugoscGeograficznaSecondTab").val();
                miejsceStartowe.szerokoscGeograficzna = $("#inputSzerokoscGeograficznaSecondTab").val();
                
                // wypelnij dwie tabele html w tej zakladce
                
                // (1) tabela z miejscem startowym :
                var tabelaDostepneTrasyStart = $("#tabelaDostepneTrasyStart");
                tabelaDostepneTrasyStart.empty();
                
                var wierszTabeli = $("<tr></tr>");
                
                var komorkaTabeli = $("<td></td>");
                komorkaTabeli.text(miejsceStartowe.wojewodztwo);
                komorkaTabeli.appendTo(wierszTabeli);
                
                komorkaTabeli = $("<td></td>");
                komorkaTabeli.text(miejsceStartowe.miasto);
                komorkaTabeli.appendTo(wierszTabeli);
                
                komorkaTabeli = $("<td></td>");
                komorkaTabeli.text(miejsceStartowe.nazwaUlicy);
                komorkaTabeli.appendTo(wierszTabeli);
                
                komorkaTabeli = $("<td></td>");
                komorkaTabeli.text(miejsceStartowe.numerDomu);
                komorkaTabeli.appendTo(wierszTabeli);
                
                komorkaTabeli = $("<td></td>");
                komorkaTabeli.text(miejsceStartowe.dlugoscGeograficzna);
                komorkaTabeli.appendTo(wierszTabeli);
                
                komorkaTabeli = $("<td></td>");
                komorkaTabeli.text(miejsceStartowe.szerokoscGeograficzna);
                komorkaTabeli.appendTo(wierszTabeli);
                
                wierszTabeli.appendTo(tabelaDostepneTrasyStart);
                
                // (2) tabela z miejscami docelowymi :
                var tabelaDostepneTrasyKoniec = $("#tabelaDostepneTrasyKoniec");
                tabelaDostepneTrasyKoniec.empty();
                
                $(miejsceDoceloweLista).each(function(index, element) {
                    wierszTabeli = $("<tr></tr>");
                     
                    komorkaTabeli = $("<td></td>");
                    komorkaTabeli.text(element.kolejnyNumerLicznik);
                    komorkaTabeli.addClass('kolejny-numer');
                    komorkaTabeli.appendTo(wierszTabeli);
                
                    komorkaTabeli = $("<td></td>");
                    komorkaTabeli.text(element.nazwa);
                    komorkaTabeli.appendTo(wierszTabeli);
                    
                    komorkaTabeli = $("<td></td>");
                    komorkaTabeli.text(element.adres);
                    komorkaTabeli.appendTo(wierszTabeli);
                    
                    komorkaTabeli = $("<td></td>");
                    komorkaTabeli.text(element.odleglosc);
                    komorkaTabeli.appendTo(wierszTabeli);
                    
                    komorkaTabeli = $("<td></td>");
                    komorkaTabeli.text(element.nazwaKategoriiMiejsca);
                    komorkaTabeli.appendTo(wierszTabeli);
                    
                    // etykieta i radio button zaznacz :
                    komorkaTabeli = $("<td></td>");
                    
                    var etykietaZaznacz = $("<label for='znalezioneMiejscaRadio"+index+"' class='col-md-2 control-label text-nowrap'>"+element.dlugoscGeograficzna+" / "+element.szerokoscGeograficzna+" </label>");
                    etykietaZaznacz.appendTo(komorkaTabeli);
                    
                    var radioZaznacz = $("<input type='radio' name='znalezioneMiejscaRadio' id='znalezioneMiejscaRadio"+index+"' value='"+element.dlugoscGeograficzna+","+element.szerokoscGeograficzna+"'>");
                    radioZaznacz.appendTo(etykietaZaznacz);
                    
                    komorkaTabeli.appendTo(wierszTabeli);
                    
                    wierszTabeli.appendTo(tabelaDostepneTrasyKoniec);
                });
            // czwarta zakladka
            } else if (event.target.text == "Mapa z wybraną trasą") {
                if ($("#tabelaJakJechac").html() == null || $("#tabelaJakJechac").html() == "") {
                    alert("Nie wygenerowano trasy.");
                    return false;
                }
            }
        });
        
        // -------------------------------- mapy ze strony 'developer.here.com' -- metody ------------------------------
        
        /**
         * Creates a H.map.Polyline from the shape of the route and adds it to the map.
         * @param {Object} route A route as received from the H.service.RoutingService
         */
        function addRouteShapeToMap(route, map) {
            var lineString = new H.geo.LineString(),
                routeShape = route.shape,
                polyline;

            routeShape.forEach(function(point) {
                var parts = point.split(',');
                lineString.pushLatLngAlt(parts[0], parts[1]);
            });

            polyline = new H.map.Polyline(lineString, {
                style: {
                    lineWidth: 4,
                    strokeColor: 'rgba(0, 128, 255, 0.7)'
                }
            });
            // Add the polyline to the map
            map.addObject(polyline);
            // And zoom to its bounding rectangle
            map.setViewBounds(polyline.getBounds(), true);
        }
        
        /**
         * Opens/Closes a infobubble
         * @param  {H.geo.Point} position     The location on the map.
         * @param  {String} text              The contents of the infobubble.
         */
        function openBubble(position, text, ui, bubble) {
            if (!bubble) {
                bubble = new H.ui.InfoBubble(
                    position,
                    // The FO property holds the province name.
                    {
                        content: text
                    });
                ui.addBubble(bubble);
            } else {
                bubble.setPosition(position);
                bubble.setContent(text);
                bubble.open();
            }
        }
        
        /**
         * Creates a series of H.map.Marker points from the route and adds them to the map.
         * @param {Object} route  A route as received from the H.service.RoutingService
         */
        function addManueversToMap(route, map, ui, bubble) {
            var svgMarkup = '<svg width="18" height="18" ' +
                'xmlns="http://www.w3.org/2000/svg">' +
                '<circle cx="8" cy="8" r="8" ' +
                'fill="#1b468d" stroke="white" stroke-width="1"  />' +
                '</svg>',
                dotIcon = new H.map.Icon(svgMarkup, {
                    anchor: {
                        x: 8,
                        y: 8
                    }
                }),
                group = new H.map.Group(),
                i,
                j;

            // Add a marker for each maneuver
            for (i = 0; i < route.leg.length; i += 1) {
                for (j = 0; j < route.leg[i].maneuver.length; j += 1) {
                    // Get the next maneuver.
                    maneuver = route.leg[i].maneuver[j];
                    // Add a marker to the maneuvers group
                    var marker = new H.map.Marker({
                        lat: maneuver.position.latitude,
                        lng: maneuver.position.longitude
                    }, {
                        icon: dotIcon
                    });
                    marker.instruction = maneuver.instruction;
                    group.addObject(marker);
                }
            }

            group.addEventListener('tap', function(evt) {
                map.setCenter(evt.target.getPosition());
                openBubble(evt.target.getPosition(), evt.target.instruction, ui, bubble);
            }, false);

            // Add the maneuvers group to the map
            map.addObject(group);
        }
        
        /**
         * Creates a series of H.map.Marker points from the route and adds them to the map.
         * @param {Object} route  A route as received from the H.service.RoutingService
         */
        function addWaypointsToPanel(waypoints, routeInstructionsContainer) {
            var nodeH3 = $("<h3></h3>"),
                // nodeH3 = document.createElement('h3'),
                waypointLabels = [],
                i;


            for (i = 0; i < waypoints.length; i += 1) {
                waypointLabels.push(waypoints[i].label)
            }

            // nodeH3.textContent = waypointLabels.join(' - ');
            nodeH3.text(waypointLabels.join(' - '));

            // routeInstructionsContainer.innerHTML = '';
            // routeInstructionsContainer.appendChild(nodeH3);
            routeInstructionsContainer.html("");
            routeInstructionsContainer.append(nodeH3);
        }
        
        /**
         * Creates a series of H.map.Marker points from the route and adds them to the map.
         * @param {Object} route  A route as received from the H.service.RoutingService
         */
        function addManueversToPanel(route, routeInstructionsContainer) {
            // var nodeOL = document.createElement('ol'),
               var nodeOL = $("<ol></ol>"), 
                i,
                j;

//            nodeOL.style.fontSize = 'small';
//            nodeOL.style.marginLeft = '5%';
//            nodeOL.style.marginRight = '5%';
//            nodeOL.className = 'directions';
            
            nodeOL.css("fontSize", "small");
            nodeOL.css("marginLeft", "5%");
            nodeOL.css("marginRight", "5%");
            nodeOL.addClass("directions");

            // Add a marker for each maneuver
            for (i = 0; i < route.leg.length; i += 1) {
                for (j = 0; j < route.leg[i].maneuver.length; j += 1) {
                    // Get the next maneuver.
                    maneuver = route.leg[i].maneuver[j];

                    // var li = document.createElement('li'),
                    var li = $("<li></li>"),
                        // spanArrow = document.createElement('span'),
                        // spanInstruction = document.createElement('span');
                        spanArrow = $("<span></span>"),
                        spanInstruction = $("<span></span>");

                    // spanArrow.className = 'arrow ' + maneuver.action;
                    // spanInstruction.innerHTML = maneuver.instruction;
                    spanArrow.addClass('arrow ' + maneuver.action);
                    spanInstruction.html(maneuver.instruction);
                    
                    // li.appendChild(spanArrow);
                    // li.appendChild(spanInstruction);
                    li.append(spanArrow);
                    li.append(spanInstruction);

                    // nodeOL.appendChild(li);
                    nodeOL.append(li);
                }
            }

            // routeInstructionsContainer.appendChild(nodeOL);
            routeInstructionsContainer.append(nodeOL);
        }
        
        /**
         * Creates a series of H.map.Marker points from the route and adds them to the map.
         * @param {Object} route  A route as received from the H.service.RoutingService
         */
        function addSummaryToPanel(summary, routeInstructionsContainer) {
            // var summaryDiv = document.createElement('div'),
            var summaryDiv = $("<div></div>"),
                content = '';
//            content += '<b>Total distance</b>: ' + summary.distance + 'm. <br/>';
//            content += '<b>Travel Time</b>: ' + summary.travelTime + ' (in current traffic)';
            content += summary.text;

            // summaryDiv.style.fontSize = 'small';
            // summaryDiv.style.marginLeft = '5%';
            // summaryDiv.style.marginRight = '5%';
            // summaryDiv.innerHTML = content;
            
            summaryDiv.css("marginLeft", "5%");
            summaryDiv.css("marginRight", "5%");
            summaryDiv.html(content);
            
            // routeInstructionsContainer.appendChild(summaryDiv);
            routeInstructionsContainer.append(summaryDiv);
        }
        
        // -------------------------------- mapy ze strony 'developer.here.com' -- metody ------------------------------
    }
);