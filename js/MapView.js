"use strict";

/*Note: Add CoastLines to MapData
        - Add Coastlines to MapData and make sure the calculation doesn't still happen
        - remove WaterColor and UseBackgroundMap
        - Add center chart
*/

/**
 * @typedef {import('./DBNUI.js')}
 * @typedef {import('./DBNGames')}
 * @typedef {import('./GameModel')}
 */

//#region myMapDataRaw NEW 2

var myMapDataRawNEW = { "Properties": { "Label": "Backstabbr", "CornerRadius": 2, "WaterColor": -16733441, "UseBackgroundMap": 0 }, "Provinces": { "Tus": { "FullName": "Tuscany", "TextLocation": [234, 428], "UnitLocations": { "[\"A\",\"Tus\"]": [243, 422], "[\"F\",\"Tus\"]": [240, 423] }, "BorderPath": [[230, 430], [240, 440], [250, 440], [260, 430], [250, 420], [250, 400], [240, 400], [230, 410]], "Neighbors": { "[\"A\",\"Tus\"]": [["A", "Pie"], ["A", "Rom"], ["A", "Ven"]], "[\"F\",\"Tus\"]": [["F", "Pie"], ["F", "LYO"], ["F", "TYS"], ["F", "Rom"]] } }, "Con": { "FullName": "Constantinople", "TextLocation": [439, 469], "DotLocation": [424, 464], "UnitLocations": { "[\"A\",\"Con\"]": [442, 463], "[\"F\",\"Con\"]": [437, 461] }, "BorderPath": [[410, 460], [410, 470], [420, 480], [470, 480], [470, 450], [440, 450], [430, 440], [420, 440], [410, 450]], "Neighbors": { "[\"A\",\"Con\"]": [["A", "Bul"], ["A", "Ank"], ["A", "Smy"]], "[\"F\",\"Con\"]": [["F", "BLA"], ["F", ["Bul", "sc"]], ["F", "AEG"], ["F", ["Bul", "ec"]], ["F", "Ank"], ["F", "Smy"]] }, "Canal": [0.5, 5.5] }, "Nap": { "FullName": "Naples", "TextLocation": [283, 494], "DotLocation": [285, 478], "UnitLocations": { "[\"A\",\"Nap\"]": [291, 491], "[\"F\",\"Nap\"]": [291, 498] }, "BorderPath": [[270, 480], [280, 490], [280, 500], [280, 510], [270, 520], [280, 530], [290, 520], [300, 510], [300, 500], [310, 490], [290, 470], [280, 470]], "Neighbors": { "[\"A\",\"Nap\"]": [["A", "Rom"], ["A", "Apu"]], "[\"F\",\"Nap\"]": [["F", "TYS"], ["F", "Rom"], ["F", "Apu"], ["F", "ION"]] } }, "ADR": { "FullName": "Adriatic Sea", "TextLocation": [287, 429], "UnitLocations": { "[\"F\",\"ADR\"]": [296, 428] }, "BorderPath": [[310, 460], [300, 450], [290, 440], [270, 420], [270, 400], [280, 390], [290, 400], [300, 410], [320, 430], [320, 450]], "Neighbors": { "[\"F\",\"ADR\"]": [["F", "ION"], ["F", "Tri"], ["F", "Alb"], ["F", "Apu"], ["F", "Ven"]] } }, "TYS": { "FullName": "Tyrrhenian Sea", "TextLocation": [237, 493], "UnitLocations": { "[\"F\",\"TYS\"]": [246, 491] }, "BorderPath": [[230, 430], [240, 440], [250, 440], [250, 450], [260, 460], [260, 470], [270, 480], [280, 490], [280, 500], [280, 510], [270, 520], [250, 520], [240, 530], [230, 520], [220, 520], [220, 470], [220, 440]], "Neighbors": { "[\"F\",\"TYS\"]": [["F", "LYO"], ["F", "WES"], ["F", "ION"], ["F", "Tun"], ["F", "Rom"], ["F", "Tus"], ["F", "Nap"]] } }, "Tri": { "FullName": "Trieste", "TextLocation": [305, 398], "DotLocation": [292, 383], "UnitLocations": { "[\"A\",\"Tri\"]": [308, 397], "[\"F\",\"Tri\"]": [305, 396] }, "BorderPath": [[280, 390], [290, 400], [300, 410], [320, 430], [340, 430], [340, 420], [330, 410], [330, 400], [320, 390], [320, 380], [320, 370], [300, 370], [280, 370]], "Neighbors": { "[\"A\",\"Tri\"]": [["A", "Ser"], ["A", "Alb"], ["A", "Tyr"], ["A", "Bud"], ["A", "Vie"], ["A", "Ven"]], "[\"F\",\"Tri\"]": [["F", "Alb"], ["F", "ADR"], ["F", "Ven"]] } }, "Bel": { "FullName": "Belgium", "TextLocation": [180, 304], "DotLocation": [192, 291], "UnitLocations": { "[\"A\",\"Bel\"]": [180, 292], "[\"F\",\"Bel\"]": [179, 291] }, "BorderPath": [[190, 280], [200, 290], [210, 300], [200, 310], [190, 320], [180, 310], [170, 300], [160, 290], [170, 280]], "Neighbors": { "[\"A\",\"Bel\"]": [["A", "Hol"], ["A", "Ruh"], ["A", "Bur"], ["A", "Pic"]], "[\"F\",\"Bel\"]": [["F", "NTH"], ["F", "Hol"], ["F", "ENG"], ["F", "Pic"]] } }, "NWG": { "FullName": "Norwegian Sea", "TextLocation": [212, 60], "UnitLocations": { "[\"F\",\"NWG\"]": [205, 85] }, "BorderPath": [[360, 30], [340, 30], [330, 30], [270, 90], [250, 110], [250, 120], [240, 130], [230, 140], [190, 140], [170, 160], [140, 160], [140, 150], [140, 0], [360, 0]], "Neighbors": { "[\"F\",\"NWG\"]": [["F", "NTH"], ["F", "NAO"], ["F", "BAR"], ["F", "Cly"], ["F", "Nwy"], ["F", "Edi"]] } }, "Mar": { "FullName": "Marseilles", "TextLocation": [159, 397], "DotLocation": [182, 406], "UnitLocations": { "[\"A\",\"Mar\"]": [184, 392], "[\"F\",\"Mar\"]": [177, 398] }, "BorderPath": [[160, 380], [180, 380], [190, 370], [200, 370], [210, 380], [200, 390], [200, 400], [200, 410], [190, 420], [180, 420], [170, 410], [140, 410], [130, 400], [140, 390], [150, 390]], "Neighbors": { "[\"A\",\"Mar\"]": [["A", "Pie"], ["A", "Gas"], ["A", "Spa"], ["A", "Bur"]], "[\"F\",\"Mar\"]": [["F", ["Spa", "sc"]], ["F", "Pie"], ["F", "LYO"]] } }, "Kie": { "FullName": "Kiel", "TextLocation": [245, 268], "DotLocation": [240, 279], "UnitLocations": { "[\"A\",\"Kie\"]": [250, 266], "[\"F\",\"Kie\"]": [250, 268] }, "BorderPath": [[240, 240], [240, 260], [230, 260], [230, 290], [240, 290], [250, 300], [260, 300], [260, 280], [270, 270], [270, 260], [260, 250], [260, 240]], "Neighbors": { "[\"A\",\"Kie\"]": [["A", "Den"], ["A", "Ber"], ["A", "Hol"], ["A", "Ruh"], ["A", "Mun"]], "[\"F\",\"Kie\"]": [["F", "BAL"], ["F", "Den"], ["F", "HEL"], ["F", "Ber"], ["F", "Hol"]] }, "Canal": [0.5, 10] }, "MAO": { "FullName": "Mid-Atlantic Ocean", "TextLocation": [35, 351], "UnitLocations": { "[\"F\",\"MAO\"]": [32, 332] }, "BorderPath": [[90, 310], [80, 310], [70, 320], [80, 330], [90, 330], [110, 350], [110, 360], [110, 390], [40, 390], [30, 400], [30, 410], [30, 470], [40, 480], [60, 480], [70, 480], [80, 490], [80, 500], [70, 500], [50, 520], [30, 520], [10, 540], [0, 540], [0, 260], [60, 260], [80, 280], [90, 280]], "Neighbors": { "[\"F\",\"MAO\"]": [["F", "IRI"], ["F", "WES"], ["F", "NAO"], ["F", "ENG"], ["F", ["Spa", "sc"]], ["F", "Gas"], ["F", ["Spa", "nc"]], ["F", "Naf"], ["F", "Por"], ["F", "Bre"]] } }, "Gre": { "FullName": "Greece", "TextLocation": [356, 477], "DotLocation": [363, 497], "UnitLocations": { "[\"A\",\"Gre\"]": [366, 478], "[\"F\",\"Gre\"]": [366, 483] }, "BorderPath": [[340, 470], [350, 480], [350, 500], [370, 520], [380, 520], [380, 510], [380, 500], [380, 490], [380, 470], [390, 460], [390, 450], [370, 450], [350, 450], [350, 460]], "Neighbors": { "[\"A\",\"Gre\"]": [["A", "Ser"], ["A", "Alb"], ["A", "Bul"]], "[\"F\",\"Gre\"]": [["F", "Alb"], ["F", ["Bul", "sc"]], ["F", "AEG"], ["F", "ION"]] } }, "NAO": { "FullName": "North Atlantic Ocean", "TextLocation": [60, 153], "UnitLocations": { "[\"F\",\"NAO\"]": [55, 170] }, "BorderPath": [[60, 240], [50, 230], [50, 220], [70, 200], [80, 200], [90, 190], [100, 200], [100, 210], [110, 220], [120, 210], [120, 190], [110, 180], [110, 170], [120, 160], [120, 150], [140, 150], [140, 0], [0, 0], [0, 260], [60, 260]], "Neighbors": { "[\"F\",\"NAO\"]": [["F", "IRI"], ["F", "MAO"], ["F", "NWG"], ["F", "Cly"], ["F", "Lvp"]] } }, "Cly": { "FullName": "Clyde", "TextLocation": [121, 179], "UnitLocations": { "[\"A\",\"Cly\"]": [126, 172], "[\"F\",\"Cly\"]": [124, 171] }, "BorderPath": [[140, 190], [120, 190], [110, 180], [110, 170], [120, 160], [120, 150], [140, 150], [140, 160]], "Neighbors": { "[\"A\",\"Cly\"]": [["A", "Lvp"], ["A", "Edi"]], "[\"F\",\"Cly\"]": [["F", "NAO"], ["F", "Lvp"], ["F", "NWG"], ["F", "Edi"]] } }, "Hol": { "FullName": "Holland", "TextLocation": [205, 281], "DotLocation": [212, 289], "UnitLocations": { "[\"A\",\"Hol\"]": [213, 276], "[\"F\",\"Hol\"]": [213, 276] }, "BorderPath": [[230, 260], [230, 290], [220, 300], [210, 300], [200, 290], [190, 280], [200, 270], [210, 260]], "Neighbors": { "[\"A\",\"Hol\"]": [["A", "Ruh"], ["A", "Kie"], ["A", "Bel"]], "[\"F\",\"Hol\"]": [["F", "NTH"], ["F", "HEL"], ["F", "Kie"], ["F", "Bel"]] } }, "Swe": { "FullName": "Sweden", "TextLocation": [297, 175], "DotLocation": [297, 189], "UnitLocations": { "[\"A\",\"Swe\"]": [304, 153], "[\"F\",\"Swe\"]": [305, 156] }, "BorderPath": [[280, 170], [280, 210], [280, 220], [290, 230], [300, 230], [310, 220], [310, 210], [330, 190], [330, 160], [320, 150], [320, 140], [350, 110], [350, 90], [360, 90], [360, 50], [350, 50], [290, 110], [290, 150], [280, 160]], "Neighbors": { "[\"A\",\"Swe\"]": [["A", "Fin"], ["A", "Den"], ["A", "Nwy"]], "[\"F\",\"Swe\"]": [["F", "Fin"], ["F", "BAL"], ["F", "Den"], ["F", "Nwy"], ["F", "BOT"], ["F", "SKA"]] } }, "Ank": { "FullName": "Ankara", "TextLocation": [505, 452], "DotLocation": [482, 459], "UnitLocations": { "[\"A\",\"Ank\"]": [500, 450], "[\"F\",\"Ank\"]": [504, 443] }, "BorderPath": [[560, 430], [490, 430], [470, 450], [470, 480], [490, 480], [500, 470], [520, 470], [530, 460], [560, 460]], "Neighbors": { "[\"A\",\"Ank\"]": [["A", "Con"], ["A", "Arm"], ["A", "Smy"]], "[\"F\",\"Ank\"]": [["F", "BLA"], ["F", "Con"], ["F", "Arm"]] } }, "Arm": { "FullName": "Armenia", "TextLocation": [585, 457], "UnitLocations": { "[\"A\",\"Arm\"]": [581, 433], "[\"F\",\"Arm\"]": [576, 427] }, "BorderPath": [[610, 480], [570, 480], [570, 470], [560, 460], [560, 430], [560, 420], [570, 410], [610, 410]], "Neighbors": { "[\"A\",\"Arm\"]": [["A", "Syr"], ["A", "Sev"], ["A", "Ank"], ["A", "Smy"]], "[\"F\",\"Arm\"]": [["F", "BLA"], ["F", "Sev"], ["F", "Ank"]] } }, "Bud": { "FullName": "Budapest", "TextLocation": [350, 380], "DotLocation": [337, 373], "UnitLocations": { "[\"A\",\"Bud\"]": [360, 373] }, "BorderPath": [[390, 360], [390, 380], [380, 390], [370, 400], [330, 400], [320, 390], [320, 380], [320, 370], [330, 370], [340, 360], [340, 340], [350, 340], [360, 350], [380, 350]], "Neighbors": { "[\"A\",\"Bud\"]": [["A", "Tri"], ["A", "Ser"], ["A", "Gal"], ["A", "Vie"], ["A", "Rum"]] } }, "Pic": { "FullName": "Picardy", "TextLocation": [152, 312], "UnitLocations": { "[\"A\",\"Pic\"]": [162, 308], "[\"F\",\"Pic\"]": [161, 309] }, "BorderPath": [[160, 290], [150, 300], [140, 300], [140, 320], [150, 320], [160, 320], [170, 330], [180, 330], [190, 320], [180, 310], [170, 300]], "Neighbors": { "[\"A\",\"Pic\"]": [["A", "Par"], ["A", "Bur"], ["A", "Bel"], ["A", "Bre"]], "[\"F\",\"Pic\"]": [["F", "ENG"], ["F", "Bel"], ["F", "Bre"]] } }, "Ven": { "FullName": "Venice", "TextLocation": [256, 385], "DotLocation": [258, 414], "UnitLocations": { "[\"A\",\"Ven\"]": [263, 387], "[\"F\",\"Ven\"]": [263, 398] }, "BorderPath": [[290, 440], [270, 420], [270, 400], [280, 390], [280, 370], [260, 370], [250, 380], [250, 400], [250, 420], [260, 430], [280, 450]], "Neighbors": { "[\"A\",\"Ven\"]": [["A", "Tri"], ["A", "Pie"], ["A", "Tyr"], ["A", "Rom"], ["A", "Apu"], ["A", "Tus"]], "[\"F\",\"Ven\"]": [["F", "Tri"], ["F", "ADR"], ["F", "Apu"]] } }, "Ukr": { "FullName": "Ukraine", "TextLocation": [420, 330], "UnitLocations": { "[\"A\",\"Ukr\"]": [423, 329] }, "BorderPath": [[380, 320], [410, 350], [410, 360], [420, 370], [440, 370], [440, 350], [460, 330], [460, 300], [400, 300]], "Neighbors": { "[\"A\",\"Ukr\"]": [["A", "Sev"], ["A", "Mos"], ["A", "Gal"], ["A", "War"], ["A", "Rum"]] } }, "Ruh": { "FullName": "Ruhr", "TextLocation": [214, 310], "UnitLocations": { "[\"A\",\"Ruh\"]": [223, 310] }, "BorderPath": [[230, 290], [220, 300], [210, 300], [200, 310], [210, 320], [210, 330], [220, 330], [230, 320], [240, 310], [250, 300], [240, 290]], "Neighbors": { "[\"A\",\"Ruh\"]": [["A", "Hol"], ["A", "Mun"], ["A", "Kie"], ["A", "Bel"], ["A", "Bur"]] } }, "Stp": { "FullName": "St Petersburg", "TextLocation": [460, 139], "DotLocation": [448, 147], "UnitLocations": { "[\"A\",\"Stp\"]": [486, 116], "[\"F\",[\"Stp\",\"sc\"]]": [414, 191], "[\"F\",[\"Stp\",\"nc\"]]": [472, 71] }, "BorderPath": [[610, 110], [610, 0], [510, 0], [510, 10], [460, 60], [450, 60], [430, 60], [410, 40], [400, 50], [390, 50], [390, 100], [410, 120], [410, 160], [400, 170], [400, 190], [370, 190], [370, 200], [380, 200], [400, 220], [450, 220], [480, 190], [520, 190], [600, 110]], "CoastPaths": { "sc": [[414, 147], [410, 152], [412, 161], [402, 177], [403, 183], [411, 184], [414, 187], [408, 187], [400, 192], [399, 197], [387, 196], [371, 198], [369, 202], [372, 205], [382, 206], [394, 205], [405, 217], [409, 228], [421, 229], [428, 225], [439, 211], [447, 209], [451, 213], [457, 210], [456, 207], [458, 194], [476, 183]], "nc": [[534, 164], [564, 159], [573, 143], [598, 132], [609, 117], [609, 0], [540, 0], [535, 9], [530, 6], [517, 19], [516, 33], [513, 38], [513, 23], [507, 20], [505, 26], [499, 33], [492, 48], [495, 58], [488, 60], [479, 57], [477, 55], [481, 50], [473, 43], [466, 45], [472, 62], [478, 66], [478, 74], [472, 72], [468, 74], [457, 91], [469, 100], [467, 106], [462, 109], [444, 101], [442, 110], [447, 115], [454, 119], [452, 122], [434, 118], [426, 103], [426, 94], [414, 88], [412, 83], [445, 84], [457, 79], [459, 66], [453, 61], [417, 47], [405, 49], [401, 45], [397, 48], [388, 61], [387, 68], [393, 73], [392, 92], [401, 110], [402, 118], [410, 130], [414, 147], [476, 183], [489, 184], [515, 169]] }, "Neighbors": { "[\"A\",\"Stp\"]": [["A", "Fin"], ["A", "Lvn"], ["A", "Nwy"], ["A", "Mos"]], "[\"F\",[\"Stp\",\"sc\"]]": [["F", "Fin"], ["F", "Lvn"], ["F", "BOT"]], "[\"F\",[\"Stp\",\"nc\"]]": [["F", "Nwy"], ["F", "BAR"]] } }, "Den": { "FullName": "Denmark", "TextLocation": [240, 217], "DotLocation": [247, 225], "UnitLocations": { "[\"A\",\"Den\"]": [249, 212], "[\"F\",\"Den\"]": [251, 216] }, "BorderPath": [[280, 210], [270, 210], [260, 200], [240, 200], [230, 210], [230, 220], [240, 230], [240, 240], [260, 240], [260, 230], [270, 220], [280, 220]], "Neighbors": { "[\"A\",\"Den\"]": [["A", "Swe"], ["A", "Kie"]], "[\"F\",\"Den\"]": [["F", "Swe"], ["F", "BAL"], ["F", "NTH"], ["F", "HEL"], ["F", "Kie"], ["F", "SKA"]] }, "Canal": [0, 11] }, "Par": { "FullName": "Paris", "TextLocation": [155, 348], "DotLocation": [147, 328], "UnitLocations": { "[\"A\",\"Par\"]": [161, 342] }, "BorderPath": [[140, 350], [150, 360], [160, 360], [170, 360], [180, 350], [180, 330], [170, 330], [160, 320], [150, 320], [140, 320]], "Neighbors": { "[\"A\",\"Par\"]": [["A", "Gas"], ["A", "Bur"], ["A", "Pic"], ["A", "Bre"]] } }, "Fin": { "FullName": "Finland", "TextLocation": [375, 150], "UnitLocations": { "[\"A\",\"Fin\"]": [377, 130], "[\"F\",\"Fin\"]": [379, 130] }, "BorderPath": [[360, 120], [340, 140], [340, 160], [360, 180], [380, 180], [390, 170], [400, 170], [410, 160], [410, 120], [390, 100], [390, 50], [360, 50], [360, 90]], "Neighbors": { "[\"A\",\"Fin\"]": [["A", "Swe"], ["A", "Stp"], ["A", "Nwy"]], "[\"F\",\"Fin\"]": [["F", ["Stp", "sc"]], ["F", "Swe"], ["F", "BOT"]] } }, "ENG": { "FullName": "English Channel", "TextLocation": [98, 296], "UnitLocations": { "[\"F\",\"ENG\"]": [118, 293] }, "BorderPath": [[170, 280], [160, 290], [150, 300], [140, 300], [130, 300], [120, 310], [90, 310], [90, 280], [100, 270], [110, 280], [130, 280], [150, 280], [160, 270]], "Neighbors": { "[\"F\",\"ENG\"]": [["F", "IRI"], ["F", "NTH"], ["F", "MAO"], ["F", "Lon"], ["F", "Wal"], ["F", "Bel"], ["F", "Bre"], ["F", "Pic"]] } }, "Yor": { "FullName": "Yorkshire", "TextLocation": [140, 232], "UnitLocations": { "[\"A\",\"Yor\"]": [149, 228], "[\"F\",\"Yor\"]": [153, 225] }, "BorderPath": [[140, 210], [160, 210], [160, 240], [150, 240], [140, 250], [130, 240], [130, 230], [140, 220]], "Neighbors": { "[\"A\",\"Yor\"]": [["A", "Lon"], ["A", "Wal"], ["A", "Lvp"], ["A", "Edi"]], "[\"F\",\"Yor\"]": [["F", "Lon"], ["F", "NTH"], ["F", "Edi"]] } }, "Mun": { "FullName": "Munich", "TextLocation": [231, 335], "DotLocation": [256, 337], "UnitLocations": { "[\"A\",\"Mun\"]": [255, 319] }, "BorderPath": [[230, 350], [270, 350], [270, 340], [270, 330], [280, 320], [280, 310], [280, 300], [260, 300], [250, 300], [240, 310], [230, 320], [220, 330], [210, 330], [210, 350]], "Neighbors": { "[\"A\",\"Mun\"]": [["A", "Sil"], ["A", "Tyr"], ["A", "Ber"], ["A", "Boh"], ["A", "Ruh"], ["A", "Kie"], ["A", "Bur"]] } }, "Wal": { "FullName": "Wales", "TextLocation": [110, 262], "UnitLocations": { "[\"A\",\"Wal\"]": [118, 262], "[\"F\",\"Wal\"]": [117, 262] }, "BorderPath": [[100, 270], [100, 260], [110, 250], [120, 240], [130, 240], [140, 250], [140, 260], [130, 270], [130, 280], [110, 280]], "Neighbors": { "[\"A\",\"Wal\"]": [["A", "Lon"], ["A", "Lvp"], ["A", "Yor"]], "[\"F\",\"Wal\"]": [["F", "IRI"], ["F", "Lon"], ["F", "Lvp"], ["F", "ENG"]] } }, "BAL": { "FullName": "Baltic Sea", "TextLocation": [284, 247], "UnitLocations": { "[\"F\",\"BAL\"]": [323, 240] }, "BorderPath": [[260, 240], [260, 230], [270, 220], [280, 220], [290, 230], [300, 230], [310, 220], [340, 220], [350, 220], [350, 240], [340, 250], [330, 260], [310, 260], [300, 260], [270, 260], [260, 250]], "Neighbors": { "[\"F\",\"BAL\"]": [["F", "BOT"], ["F", "SKA"], ["F", "Swe"], ["F", "Den"], ["F", "Lvn"], ["F", "Ber"], ["F", "Kie"], ["F", "Pru"]] } }, "Pie": { "FullName": "Piedmont", "TextLocation": [216, 395], "UnitLocations": { "[\"A\",\"Pie\"]": [220, 394], "[\"F\",\"Pie\"]": [222, 396] }, "BorderPath": [[210, 380], [200, 390], [200, 400], [200, 410], [230, 410], [240, 400], [250, 400], [250, 380], [240, 370], [230, 380]], "Neighbors": { "[\"A\",\"Pie\"]": [["A", "Tyr"], ["A", "Tus"], ["A", "Mar"], ["A", "Ven"]], "[\"F\",\"Pie\"]": [["F", "LYO"], ["F", "Tus"], ["F", "Mar"]] } }, "Ser": { "FullName": "Serbia", "TextLocation": [348, 427], "DotLocation": [343, 409], "UnitLocations": { "[\"A\",\"Ser\"]": [358, 421] }, "BorderPath": [[370, 400], [330, 400], [330, 410], [340, 420], [340, 430], [350, 440], [350, 450], [370, 450], [370, 420], [380, 410]], "Neighbors": { "[\"A\",\"Ser\"]": [["A", "Tri"], ["A", "Alb"], ["A", "Bul"], ["A", "Gre"], ["A", "Bud"], ["A", "Rum"]] } }, "SKA": { "FullName": "Skagerrak", "TextLocation": [251, 191], "UnitLocations": { "[\"F\",\"SKA\"]": [260, 185] }, "BorderPath": [[240, 170], [280, 170], [280, 210], [270, 210], [260, 200], [240, 200]], "Neighbors": { "[\"F\",\"SKA\"]": [["F", "NTH"], ["F", "BAL"], ["F", "Swe"], ["F", "Den"], ["F", "Nwy"]] } }, "BOT": { "FullName": "Gulf of Bothnia", "TextLocation": [336, 198], "UnitLocations": { "[\"F\",\"BOT\"]": [346, 189] }, "BorderPath": [[310, 220], [310, 210], [330, 190], [330, 160], [320, 150], [320, 140], [350, 110], [350, 90], [360, 90], [360, 120], [340, 140], [340, 160], [360, 180], [380, 180], [390, 170], [400, 170], [400, 190], [370, 190], [370, 200], [360, 210], [350, 220], [340, 220]], "Neighbors": { "[\"F\",\"BOT\"]": [["F", "BAL"], ["F", "Fin"], ["F", ["Stp", "sc"]], ["F", "Swe"], ["F", "Lvn"]] } }, "Ber": { "FullName": "Berlin", "TextLocation": [275, 282], "DotLocation": [268, 287], "UnitLocations": { "[\"A\",\"Ber\"]": [282, 277], "[\"F\",\"Ber\"]": [285, 279] }, "BorderPath": [[300, 260], [270, 260], [270, 270], [260, 280], [260, 300], [280, 300], [290, 300], [300, 290]], "Neighbors": { "[\"A\",\"Ber\"]": [["A", "Sil"], ["A", "Mun"], ["A", "Kie"], ["A", "Pru"]], "[\"F\",\"Ber\"]": [["F", "BAL"], ["F", "Kie"], ["F", "Pru"]] } }, "LYO": { "FullName": "Gulf of Lyon", "TextLocation": [170, 447], "UnitLocations": { "[\"F\",\"LYO\"]": [173, 440] }, "BorderPath": [[120, 470], [120, 450], [130, 440], [130, 420], [140, 410], [170, 410], [180, 420], [190, 420], [200, 410], [230, 410], [230, 430], [220, 440], [220, 470]], "Neighbors": { "[\"F\",\"LYO\"]": [["F", "TYS"], ["F", "WES"], ["F", ["Spa", "sc"]], ["F", "Pie"], ["F", "Tus"], ["F", "Mar"]] } }, "Smy": { "FullName": "Smyrna", "TextLocation": [460, 500], "DotLocation": [430, 492], "UnitLocations": { "[\"A\",\"Smy\"]": [498, 495], "[\"F\",\"Smy\"]": [490, 497] }, "BorderPath": [[420, 480], [420, 500], [440, 520], [480, 520], [490, 510], [540, 510], [570, 480], [570, 470], [560, 460], [530, 460], [520, 470], [500, 470], [490, 480], [470, 480]], "Neighbors": { "[\"A\",\"Smy\"]": [["A", "Syr"], ["A", "Con"], ["A", "Arm"], ["A", "Ank"]], "[\"F\",\"Smy\"]": [["F", "EAS"], ["F", "Syr"], ["F", "Con"], ["F", "AEG"]] } }, "ION": { "FullName": "Ionian Sea", "TextLocation": [325, 523], "UnitLocations": { "[\"F\",\"ION\"]": [330, 529] }, "BorderPath": [[270, 520], [280, 530], [290, 520], [300, 510], [300, 500], [310, 490], [320, 500], [330, 490], [310, 470], [310, 460], [320, 450], [330, 460], [340, 470], [350, 480], [350, 500], [370, 520], [380, 520], [390, 530], [400, 530], [400, 560], [230, 560], [230, 550], [240, 540], [240, 530], [250, 520]], "Neighbors": { "[\"F\",\"ION\"]": [["F", "EAS"], ["F", "AEG"], ["F", "TYS"], ["F", "ADR"], ["F", "Alb"], ["F", "Tun"], ["F", "Gre"], ["F", "Apu"], ["F", "Nap"]] } }, "Pru": { "FullName": "Prussia", "TextLocation": [314, 275], "UnitLocations": { "[\"A\",\"Pru\"]": [319, 273], "[\"F\",\"Pru\"]": [322, 273] }, "BorderPath": [[340, 250], [330, 260], [310, 260], [300, 260], [300, 290], [330, 290], [350, 270], [350, 260]], "Neighbors": { "[\"A\",\"Pru\"]": [["A", "Sil"], ["A", "Lvn"], ["A", "Ber"], ["A", "War"]], "[\"F\",\"Pru\"]": [["F", "BAL"], ["F", "Ber"], ["F", "Lvn"]] } }, "Gal": { "FullName": "Galicia", "TextLocation": [355, 333], "UnitLocations": { "[\"A\",\"Gal\"]": [364, 333] }, "BorderPath": [[340, 310], [350, 320], [380, 320], [410, 350], [410, 360], [390, 360], [380, 350], [360, 350], [350, 340], [340, 340], [320, 340], [320, 320], [330, 320]], "Neighbors": { "[\"A\",\"Gal\"]": [["A", "Sil"], ["A", "Boh"], ["A", "Bud"], ["A", "Ukr"], ["A", "Vie"], ["A", "War"], ["A", "Rum"]] } }, "Lon": { "FullName": "London", "TextLocation": [145, 260], "DotLocation": [140, 268], "UnitLocations": { "[\"A\",\"Lon\"]": [156, 256], "[\"F\",\"Lon\"]": [156, 258] }, "BorderPath": [[160, 240], [170, 250], [170, 260], [160, 270], [150, 280], [130, 280], [130, 270], [140, 260], [140, 250], [150, 240]], "Neighbors": { "[\"A\",\"Lon\"]": [["A", "Wal"], ["A", "Yor"]], "[\"F\",\"Lon\"]": [["F", "NTH"], ["F", "Wal"], ["F", "Yor"], ["F", "ENG"]] } }, "Naf": { "FullName": "North Africa", "TextLocation": [50, 540], "UnitLocations": { "[\"A\",\"Naf\"]": [129, 536], "[\"F\",\"Naf\"]": [139, 537] }, "BorderPath": [[190, 520], [110, 520], [90, 500], [80, 500], [70, 500], [50, 520], [30, 520], [10, 540], [0, 540], [0, 560], [190, 560]], "Neighbors": { "[\"A\",\"Naf\"]": [["A", "Tun"]], "[\"F\",\"Naf\"]": [["F", "Tun"], ["F", "WES"], ["F", "MAO"]] } }, "Rum": { "FullName": "Rumania", "TextLocation": [404, 393], "DotLocation": [389, 393], "UnitLocations": { "[\"A\",\"Rum\"]": [411, 387], "[\"F\",\"Rum\"]": [415, 395] }, "BorderPath": [[410, 360], [390, 360], [390, 380], [380, 390], [370, 400], [380, 410], [430, 410], [430, 400], [440, 390], [440, 370], [420, 370]], "Neighbors": { "[\"A\",\"Rum\"]": [["A", "Ser"], ["A", "Bul"], ["A", "Sev"], ["A", "Ukr"], ["A", "Bud"], ["A", "Gal"]], "[\"F\",\"Rum\"]": [["F", "BLA"], ["F", "Sev"], ["F", ["Bul", "ec"]]] } }, "Boh": { "FullName": "Bohemia", "TextLocation": [285, 333], "UnitLocations": { "[\"A\",\"Boh\"]": [289, 334] }, "BorderPath": [[270, 350], [270, 340], [270, 330], [280, 320], [300, 320], [310, 320], [320, 320], [320, 340], [310, 340], [300, 350]], "Neighbors": { "[\"A\",\"Boh\"]": [["A", "Sil"], ["A", "Tyr"], ["A", "Mun"], ["A", "Vie"], ["A", "Gal"]] } }, "HEL": { "FullName": "Helgoland Bight", "TextLocation": [215, 248], "UnitLocations": { "[\"F\",\"HEL\"]": [226, 242] }, "BorderPath": [[230, 220], [240, 230], [240, 240], [240, 260], [230, 260], [210, 260], [210, 220]], "Neighbors": { "[\"F\",\"HEL\"]": [["F", "NTH"], ["F", "Den"], ["F", "Hol"], ["F", "Kie"]] } }, "Sev": { "FullName": "Sevastopol", "TextLocation": [540, 340], "DotLocation": [545, 349], "UnitLocations": { "[\"A\",\"Sev\"]": [515, 320], "[\"F\",\"Sev\"]": [515, 346] }, "BorderPath": [[440, 390], [460, 390], [480, 370], [540, 370], [570, 400], [570, 410], [610, 410], [610, 320], [600, 320], [570, 280], [480, 280], [460, 300], [460, 330], [440, 350], [440, 370]], "Neighbors": { "[\"A\",\"Sev\"]": [["A", "Ukr"], ["A", "Mos"], ["A", "Arm"], ["A", "Rum"]], "[\"F\",\"Sev\"]": [["F", "BLA"], ["F", "Arm"], ["F", "Rum"]] } }, "Edi": { "FullName": "Edinburgh", "TextLocation": [145, 174], "DotLocation": [148, 196], "UnitLocations": { "[\"A\",\"Edi\"]": [152, 173], "[\"F\",\"Edi\"]": [155, 175] }, "BorderPath": [[140, 160], [170, 160], [170, 170], [160, 180], [160, 210], [140, 210], [140, 190]], "Neighbors": { "[\"A\",\"Edi\"]": [["A", "Cly"], ["A", "Lvp"], ["A", "Yor"]], "[\"F\",\"Edi\"]": [["F", "NTH"], ["F", "Cly"], ["F", "Yor"], ["F", "NWG"]] } }, "Spa": { "FullName": "Spain", "TextLocation": [85, 450], "DotLocation": [80, 432], "UnitLocations": { "[\"A\",\"Spa\"]": [100, 421], "[\"F\",[\"Spa\",\"sc\"]]": [102, 465], "[\"F\",[\"Spa\",\"nc\"]]": [80, 400] }, "BorderPath": [[120, 400], [110, 390], [40, 390], [30, 400], [30, 410], [60, 410], [60, 480], [70, 480], [80, 490], [90, 480], [110, 480], [120, 470], [120, 450], [130, 440], [130, 420], [140, 410], [130, 400]], "CoastPaths": { "sc": [[134, 417], [40, 441], [34, 447], [36, 457], [27, 468], [33, 475], [34, 484], [37, 490], [47, 488], [52, 489], [60, 486], [78, 491], [83, 494], [86, 485], [90, 483], [98, 484], [107, 474], [113, 473], [115, 469], [110, 461], [124, 444], [131, 439], [146, 438], [157, 432], [158, 425], [154, 427], [142, 417], [135, 414]], "nc": [[134, 417], [123, 412], [113, 407], [112, 399], [101, 396], [96, 397], [72, 384], [59, 381], [54, 375], [48, 374], [46, 378], [39, 375], [33, 381], [35, 384], [32, 396], [43, 395], [42, 399], [55, 400], [62, 407], [61, 411], [52, 412], [42, 432], [37, 431], [40, 441]] }, "Neighbors": { "[\"A\",\"Spa\"]": [["A", "Gas"], ["A", "Mar"], ["A", "Por"]], "[\"F\",[\"Spa\",\"sc\"]]": [["F", "LYO"], ["F", "MAO"], ["F", "WES"], ["F", "Por"], ["F", "Mar"]], "[\"F\",[\"Spa\",\"nc\"]]": [["F", "Gas"], ["F", "MAO"], ["F", "Por"]] } }, "Bul": { "FullName": "Bulgaria", "TextLocation": [395, 433], "DotLocation": [377, 434], "UnitLocations": { "[\"A\",\"Bul\"]": [395, 433], "[\"F\",[\"Bul\",\"sc\"]]": [399, 449], "[\"F\",[\"Bul\",\"ec\"]]": [417, 425] }, "BorderPath": [[420, 440], [430, 440], [430, 410], [380, 410], [370, 420], [370, 450], [390, 450], [390, 460], [410, 460], [410, 450]], "CoastPaths": { "sc": [[413, 464], [412, 454], [371, 438], [366, 439], [371, 456], [365, 461], [369, 464], [376, 464], [388, 460], [392, 472], [400, 468], [408, 470], [413, 464], [412, 454]], "ec": [[412, 454], [420, 451], [426, 450], [422, 441], [425, 427], [429, 426], [430, 423], [422, 420], [410, 420], [404, 422], [398, 427], [390, 425], [382, 427], [375, 423], [370, 425], [367, 421], [365, 425], [368, 433], [371, 438]] }, "Neighbors": { "[\"A\",\"Bul\"]": [["A", "Ser"], ["A", "Con"], ["A", "Gre"], ["A", "Rum"]], "[\"F\",[\"Bul\",\"sc\"]]": [["F", "Con"], ["F", "AEG"], ["F", "Gre"]], "[\"F\",[\"Bul\",\"ec\"]]": [["F", "BLA"], ["F", "Con"], ["F", "Rum"]] } }, "IRI": { "FullName": "Irish Sea", "TextLocation": [79, 255], "UnitLocations": { "[\"F\",\"IRI\"]": [87, 251] }, "BorderPath": [[100, 270], [100, 260], [110, 250], [120, 240], [110, 230], [110, 220], [100, 210], [80, 230], [80, 240], [60, 240], [60, 260], [80, 280], [90, 280]], "Neighbors": { "[\"F\",\"IRI\"]": [["F", "MAO"], ["F", "NAO"], ["F", "ENG"], ["F", "Wal"], ["F", "Lvp"]] } }, "War": { "FullName": "Warsaw", "TextLocation": [355, 301], "DotLocation": [360, 280], "UnitLocations": { "[\"A\",\"War\"]": [364, 303] }, "BorderPath": [[340, 310], [330, 300], [330, 290], [350, 270], [380, 270], [400, 290], [400, 300], [380, 320], [350, 320]], "Neighbors": { "[\"A\",\"War\"]": [["A", "Sil"], ["A", "Lvn"], ["A", "Ukr"], ["A", "Mos"], ["A", "Gal"], ["A", "Pru"]] } }, "BAR": { "FullName": "Barents Sea", "TextLocation": [440, 20], "UnitLocations": { "[\"F\",\"BAR\"]": [445, 31] }, "BorderPath": [[510, 0], [510, 10], [460, 60], [450, 60], [430, 60], [410, 40], [400, 30], [360, 30], [360, 0]], "Neighbors": { "[\"F\",\"BAR\"]": [["F", "NWG"], ["F", "Nwy"], ["F", ["Stp", "nc"]]] } }, "Vie": { "FullName": "Vienna", "TextLocation": [307, 360], "DotLocation": [325, 347], "UnitLocations": { "[\"A\",\"Vie\"]": [314, 353] }, "BorderPath": [[300, 350], [310, 340], [320, 340], [340, 340], [340, 360], [330, 370], [320, 370], [300, 370]], "Neighbors": { "[\"A\",\"Vie\"]": [["A", "Tri"], ["A", "Tyr"], ["A", "Boh"], ["A", "Bud"], ["A", "Gal"]] } }, "Apu": { "FullName": "Apulia", "TextLocation": [285, 462], "UnitLocations": { "[\"A\",\"Apu\"]": [293, 458], "[\"F\",\"Apu\"]": [297, 460] }, "BorderPath": [[310, 490], [320, 500], [330, 490], [310, 470], [310, 460], [300, 450], [290, 440], [280, 450], [280, 470], [290, 470]], "Neighbors": { "[\"A\",\"Apu\"]": [["A", "Rom"], ["A", "Nap"], ["A", "Ven"]], "[\"F\",\"Apu\"]": [["F", "ADR"], ["F", "Nap"], ["F", "ION"], ["F", "Ven"]] } }, "Rom": { "FullName": "Rome", "TextLocation": [255, 453], "DotLocation": [269, 462], "UnitLocations": { "[\"A\",\"Rom\"]": [265, 452], "[\"F\",\"Rom\"]": [263, 454] }, "BorderPath": [[250, 440], [250, 450], [260, 460], [260, 470], [270, 480], [280, 470], [280, 450], [260, 430]], "Neighbors": { "[\"A\",\"Rom\"]": [["A", "Apu"], ["A", "Nap"], ["A", "Tus"], ["A", "Ven"]], "[\"F\",\"Rom\"]": [["F", "TYS"], ["F", "Tus"], ["F", "Nap"]] } }, "Tun": { "FullName": "Tunis", "TextLocation": [201, 547], "DotLocation": [228, 532], "UnitLocations": { "[\"A\",\"Tun\"]": [210, 542], "[\"F\",\"Tun\"]": [214, 537] }, "BorderPath": [[230, 560], [230, 550], [240, 540], [240, 530], [230, 520], [220, 520], [190, 520], [190, 560]], "Neighbors": { "[\"A\",\"Tun\"]": [["A", "Naf"]], "[\"F\",\"Tun\"]": [["F", "TYS"], ["F", "WES"], ["F", "ION"], ["F", "Naf"]] } }, "Mos": { "FullName": "Moscow", "TextLocation": [460, 255], "DotLocation": [475, 237], "UnitLocations": { "[\"A\",\"Mos\"]": [505, 241] }, "BorderPath": [[610, 110], [600, 110], [520, 190], [480, 190], [450, 220], [400, 220], [400, 250], [380, 270], [400, 290], [400, 300], [460, 300], [480, 280], [570, 280], [600, 320], [610, 320]], "Neighbors": { "[\"A\",\"Mos\"]": [["A", "Stp"], ["A", "Sev"], ["A", "Lvn"], ["A", "Ukr"], ["A", "War"]] } }, "WES": { "FullName": "Western Mediterranean", "TextLocation": [155, 496], "UnitLocations": { "[\"F\",\"WES\"]": [153, 492] }, "BorderPath": [[80, 490], [90, 480], [110, 480], [120, 470], [220, 470], [220, 520], [190, 520], [110, 520], [90, 500], [80, 500]], "Neighbors": { "[\"F\",\"WES\"]": [["F", "LYO"], ["F", "TYS"], ["F", "MAO"], ["F", ["Spa", "sc"]], ["F", "Tun"], ["F", "Naf"]] } }, "Lvn": { "FullName": "Livonia", "TextLocation": [368, 250], "UnitLocations": { "[\"A\",\"Lvn\"]": [373, 231], "[\"F\",\"Lvn\"]": [365, 235] }, "BorderPath": [[370, 200], [360, 210], [350, 220], [350, 240], [340, 250], [350, 260], [350, 270], [380, 270], [400, 250], [400, 220], [380, 200]], "Neighbors": { "[\"A\",\"Lvn\"]": [["A", "Stp"], ["A", "Mos"], ["A", "Pru"], ["A", "War"]], "[\"F\",\"Lvn\"]": [["F", ["Stp", "sc"]], ["F", "BAL"], ["F", "BOT"], ["F", "Pru"]] } }, "NTH": { "FullName": "North Sea", "TextLocation": [184, 207], "UnitLocations": { "[\"F\",\"NTH\"]": [197, 205] }, "BorderPath": [[230, 220], [230, 210], [240, 200], [240, 170], [230, 160], [230, 140], [190, 140], [170, 160], [170, 170], [160, 180], [160, 210], [160, 240], [170, 250], [170, 260], [160, 270], [170, 280], [190, 280], [200, 270], [210, 260], [210, 220]], "Neighbors": { "[\"F\",\"NTH\"]": [["F", "HEL"], ["F", "ENG"], ["F", "NWG"], ["F", "SKA"], ["F", "Lon"], ["F", "Den"], ["F", "Nwy"], ["F", "Hol"], ["F", "Yor"], ["F", "Bel"], ["F", "Edi"]] } }, "Alb": { "FullName": "Albania", "TextLocation": [330, 448], "UnitLocations": { "[\"A\",\"Alb\"]": [336, 447], "[\"F\",\"Alb\"]": [334, 450] }, "BorderPath": [[320, 430], [320, 450], [330, 460], [340, 470], [350, 460], [350, 450], [350, 440], [340, 430]], "Neighbors": { "[\"A\",\"Alb\"]": [["A", "Tri"], ["A", "Ser"], ["A", "Gre"]], "[\"F\",\"Alb\"]": [["F", "Tri"], ["F", "ADR"], ["F", "Gre"], ["F", "ION"]] } }, "Syr": { "FullName": "Syria", "TextLocation": [572, 516], "UnitLocations": { "[\"A\",\"Syr\"]": [571, 506], "[\"F\",\"Syr\"]": [555, 526] }, "BorderPath": [[570, 480], [610, 480], [610, 560], [540, 560], [540, 510]], "Neighbors": { "[\"A\",\"Syr\"]": [["A", "Arm"], ["A", "Smy"]], "[\"F\",\"Syr\"]": [["F", "EAS"], ["F", "Smy"]] } }, "Gas": { "FullName": "Gascony", "TextLocation": [120, 375], "UnitLocations": { "[\"A\",\"Gas\"]": [133, 371], "[\"F\",\"Gas\"]": [126, 372] }, "BorderPath": [[110, 350], [110, 360], [110, 390], [120, 400], [130, 400], [140, 390], [150, 390], [160, 380], [160, 360], [150, 360], [140, 350]], "Neighbors": { "[\"A\",\"Gas\"]": [["A", "Par"], ["A", "Spa"], ["A", "Mar"], ["A", "Bur"], ["A", "Bre"]], "[\"F\",\"Gas\"]": [["F", "MAO"], ["F", ["Spa", "nc"]], ["F", "Bre"]] } }, "Bre": { "FullName": "Brest", "TextLocation": [117, 336], "DotLocation": [96, 320], "UnitLocations": { "[\"A\",\"Bre\"]": [123, 324], "[\"F\",\"Bre\"]": [116, 321] }, "BorderPath": [[140, 300], [130, 300], [120, 310], [90, 310], [80, 310], [70, 320], [80, 330], [90, 330], [110, 350], [140, 350], [140, 320]], "Neighbors": { "[\"A\",\"Bre\"]": [["A", "Par"], ["A", "Gas"], ["A", "Pic"]], "[\"F\",\"Bre\"]": [["F", "Gas"], ["F", "MAO"], ["F", "ENG"], ["F", "Pic"]] } }, "Tyr": { "FullName": "Tyrolia", "TextLocation": [247, 362], "UnitLocations": { "[\"A\",\"Tyr\"]": [256, 360] }, "BorderPath": [[230, 350], [270, 350], [300, 350], [300, 370], [280, 370], [260, 370], [250, 380], [240, 370], [230, 360]], "Neighbors": { "[\"A\",\"Tyr\"]": [["A", "Tri"], ["A", "Pie"], ["A", "Boh"], ["A", "Mun"], ["A", "Vie"], ["A", "Ven"]] } }, "Sil": { "FullName": "Silesia", "TextLocation": [304, 306], "UnitLocations": { "[\"A\",\"Sil\"]": [306, 304] }, "BorderPath": [[280, 320], [300, 320], [310, 320], [320, 320], [330, 320], [340, 310], [330, 300], [330, 290], [300, 290], [290, 300], [280, 300], [280, 310]], "Neighbors": { "[\"A\",\"Sil\"]": [["A", "Ber"], ["A", "Boh"], ["A", "Mun"], ["A", "Gal"], ["A", "Pru"], ["A", "War"]] } }, "EAS": { "FullName": "Eastern Mediterranean", "TextLocation": [445, 543], "UnitLocations": { "[\"F\",\"EAS\"]": [454, 536] }, "BorderPath": [[440, 520], [480, 520], [490, 510], [540, 510], [540, 560], [400, 560], [400, 530], [430, 530]], "Neighbors": { "[\"F\",\"EAS\"]": [["F", "AEG"], ["F", "ION"], ["F", "Syr"], ["F", "Smy"]] } }, "Lvp": { "FullName": "Liverpool", "TextLocation": [119, 219], "DotLocation": [127, 202], "UnitLocations": { "[\"A\",\"Lvp\"]": [125, 220], "[\"F\",\"Lvp\"]": [126, 213] }, "BorderPath": [[120, 240], [110, 230], [110, 220], [120, 210], [120, 190], [140, 190], [140, 210], [140, 220], [130, 230], [130, 240]], "Neighbors": { "[\"A\",\"Lvp\"]": [["A", "Wal"], ["A", "Cly"], ["A", "Yor"], ["A", "Edi"]], "[\"F\",\"Lvp\"]": [["F", "IRI"], ["F", "Wal"], ["F", "Cly"], ["F", "NAO"]] } }, "Por": { "FullName": "Portugal", "TextLocation": [34, 438], "DotLocation": [41, 419], "UnitLocations": { "[\"A\",\"Por\"]": [43, 455], "[\"F\",\"Por\"]": [42, 444] }, "BorderPath": [[30, 410], [30, 470], [40, 480], [60, 480], [60, 410]], "Neighbors": { "[\"A\",\"Por\"]": [["A", "Spa"]], "[\"F\",\"Por\"]": [["F", ["Spa", "sc"]], ["F", "MAO"], ["F", ["Spa", "nc"]]] } }, "BLA": { "FullName": "Black Sea", "TextLocation": [496, 410], "UnitLocations": { "[\"F\",\"BLA\"]": [490, 400] }, "BorderPath": [[440, 450], [430, 440], [430, 410], [430, 400], [440, 390], [460, 390], [480, 370], [540, 370], [570, 400], [570, 410], [560, 420], [560, 430], [490, 430], [470, 450]], "Neighbors": { "[\"F\",\"BLA\"]": [["F", "AEG"], ["F", "Con"], ["F", "Sev"], ["F", ["Bul", "ec"]], ["F", "Arm"], ["F", "Ank"], ["F", "Rum"]] } }, "AEG": { "FullName": "Aegean Sea", "TextLocation": [388, 500], "UnitLocations": { "[\"F\",\"AEG\"]": [401, 499] }, "BorderPath": [[380, 520], [380, 510], [380, 500], [380, 490], [380, 470], [390, 460], [410, 460], [410, 470], [420, 480], [420, 500], [440, 520], [430, 530], [390, 530]], "Neighbors": { "[\"F\",\"AEG\"]": [["F", "EAS"], ["F", "BLA"], ["F", "ION"], ["F", "Con"], ["F", ["Bul", "sc"]], ["F", "Gre"], ["F", "Smy"]] } }, "Nwy": { "FullName": "Norway", "TextLocation": [255, 149], "DotLocation": [241, 146], "UnitLocations": { "[\"A\",\"Nwy\"]": [264, 131], "[\"F\",\"Nwy\"]": [264, 132] }, "BorderPath": [[410, 40], [400, 30], [360, 30], [340, 30], [330, 30], [270, 90], [250, 110], [250, 120], [240, 130], [230, 140], [230, 160], [240, 170], [280, 170], [280, 160], [290, 150], [290, 110], [350, 50], [360, 50], [390, 50], [400, 50]], "Neighbors": { "[\"A\",\"Nwy\"]": [["A", "Fin"], ["A", "Swe"], ["A", "Stp"]], "[\"F\",\"Nwy\"]": [["F", "Swe"], ["F", "NTH"], ["F", ["Stp", "nc"]], ["F", "NWG"], ["F", "BAR"], ["F", "SKA"]] } }, "Bur": { "FullName": "Burgundy", "TextLocation": [186, 345], "UnitLocations": { "[\"A\",\"Bur\"]": [191, 350] }, "BorderPath": [[190, 320], [200, 310], [210, 320], [210, 330], [210, 350], [200, 360], [200, 370], [190, 370], [180, 380], [160, 380], [160, 360], [170, 360], [180, 350], [180, 330]], "Neighbors": { "[\"A\",\"Bur\"]": [["A", "Par"], ["A", "Gas"], ["A", "Ruh"], ["A", "Mun"], ["A", "Mar"], ["A", "Bel"], ["A", "Pic"]] } } } }

//#endregion

/**
 * 
 * @param {any} gamedata 
 */
function ProcessMapData(gamedata) {

    var game = new gmGame(gamedata);

    var divBoard = dbnHere().addDiv();
    divBoard.style.border = "10px solid black";
    divBoard.style.borderRadius = "10px";

    var divRow = divBoard.addDiv();
    divRow.style.display = "table-row";

    let divsb = divRow.addDiv();
    divsb.style.display = "table-cell";
    divsb.style.verticalAlign = "top";
    var sb = new dbnScoreboard(divsb);

    let divmv = divRow.addDiv();
    divmv.style.display = "table-cell";
    divmv.style.width = "100%";
    var mv = new dbnMapView(divmv);

    mv.Game = game;
    //mv.GamePhase = game.GamePhases[game.GamePhases.length - 1];
    var phase = game.GamePhases[0];
    mv.GamePhase = phase;

    sb.BindToMapView(mv);

}

//#region Change data for testing

/**
 * 
 * @param {gmGamePhase} gamephase 
 * @param {dbnMapData} mapdata 
 */
function MakeAllAustrianArmies(gamephase, mapdata) {
    gamephase.Units = {};
    gamephase.Units["Austria"] = Object.values(mapdata.ProvinceData).filter(x => x.ProvinceType == ProvinceTypeEnum.Land).map(pd => new gmUnitWithLocation("A", new gmLocation(pd.Province, ProvinceCoastEnum.None)));
}

/**
 * 
 * @param {gmGamePhase} gamephase 
 * @param {dbnMapData} mapdata 
 */
function MakeAllFleets(gamephase, mapdata) {
    gamephase.Units = {};
    Object.values(CountryEnum).forEach(x => gamephase.Units[x] = []);

    Object.values(mapdata.ProvinceData).forEach(pd => {
        switch (pd.Province) {
            case ProvinceEnum.Stp:
            case ProvinceEnum.Spa:
                gamephase.Units[CountryEnum.Germany].push(new gmUnitWithLocation("F", new gmLocation(pd.Province, ProvinceCoastEnum.nc)));
                gamephase.Units[CountryEnum.Italy].push(new gmUnitWithLocation("F", new gmLocation(pd.Province, ProvinceCoastEnum.sc)));
                break;
            case ProvinceEnum.Bul:
                gamephase.Units[CountryEnum.Russia].push(new gmUnitWithLocation("F", new gmLocation(pd.Province, ProvinceCoastEnum.ec)));
                gamephase.Units[CountryEnum.France].push(new gmUnitWithLocation("F", new gmLocation(pd.Province, ProvinceCoastEnum.sc)));
                break;
            default:
                Object.keys(pd.UnitLocations).forEach(x => {
                    var uwl = gmUnitWithLocation.FromJSON(JSON.parse(x));
                    if (uwl.UnitType == "F") {
                        gamephase.Units[pd.ProvinceType == ProvinceTypeEnum.Land ? CountryEnum.Austria : CountryEnum.England].push(uwl);
                    }
                });
        }
    });
}

//#endregion

/**
 * 
 * @param {number[]} pt0 
 * @param {number[]} pt1 
 */
function PointsAreEqual(pt0, pt1) {
    return pt0[0] == pt1[0] && pt0[1] == pt1[1];
}

/**
 * 
 * @param {number[]} ptA0 
 * @param {number[]} ptA1 
 * @param {number[]} ptB0 
 * @param {number[]} ptB1 
 */
function SegmentsAreEqual(ptA0, ptA1, ptB0, ptB1) {
    //return ptA0[0] == ptB0[0] && ptA0[1] == ptB0[1] && ptA1[0] == ptB1[0] && ptA1[1] == ptB1[1]
    return PointsAreEqual(ptA0, ptB0) && PointsAreEqual(ptA1, ptB1);
}

//#region dbnProvinceData

class dbnProvinceData {

    //#region constructor

    /**
     * 
     * @param {string} province 
     * @param {object} json 
     */
    constructor(province, json) {
        this.Province = province;
        this.ProvinceType = (myGameModel.SeaProvinces.includes(province)) ? ProvinceTypeEnum.Water : ProvinceTypeEnum.Land;
        this.HasSupplyCenter = myGameModel.SupplyCenters.includes(province);
        this.HomeCountry = myGameModel.GetHomeCountryForProvince(province);

        if ("FullName" in json) this.FullName = json["FullName"];
        if ("TextLocation" in json) this.TextLocation = json["TextLocation"];
        if ("DotLocation" in json) this.DotLocation = json["DotLocation"];

        if ("UnitLocations" in json) Object.entries(json["UnitLocations"]).forEach(x => this.UnitLocations[x[0]] = x[1]);
        if ("Neighbors" in json) Object.entries(json["Neighbors"]).forEach(x => this.Neighbors[x[0]] = x[1]);

        if ("BorderPath" in json) {
            this.BorderPath = dbnProvinceData.PathArrayToString(json["BorderPath"]);
            this.BorderPathPoints = json["BorderPath"];
        }
        if ("CoastPaths" in json) Object.entries(json["CoastPaths"]).forEach(x => this.CoastPaths[x[0]] = x[1]);

        if ("Canal" in json && Array.isArray(json["Canal"])) this.Canal = json["Canal"];

        var ulx, uly, lrx, lry;

        json["BorderPath"].forEach(x => {
            ulx = Math.min(x[0], ulx ?? x[0]);
            uly = Math.min(x[1], uly ?? x[1]);
            lrx = Math.max(x[0], lrx ?? x[0]);
            lry = Math.max(x[1], lry ?? x[1]);
        });
        this.UpperLeft = [ulx, uly];
        this.LowerRight = [lrx, lry];
    }

    /**@type{number[]} */
    UpperLeft;
    /**@type{number[]} */
    LowerRight;

    GetDefaultUnitWithLocation() {
        return new gmUnitWithLocation(this.ProvinceType == ProvinceTypeEnum.Land ? UnitTypeEnum.Army : UnitTypeEnum.Fleet, new gmLocation(this.Province));
    }

    /**
     * 
     * @param {number[][]} points 
     */
    static PathArrayToString(points, closed = true) {
        var ret = "";
        points.forEach((x, i) => ret += (i == 0 ? "M" : "L") + x[0] + " " + x[1] + " ");
        if (closed) ret += "Z";
        return ret;
    }

    //#endregion

    //#region Game Structure

    /**@type{string} */
    Province;

    /**@type{string} */
    ProvinceType;

    /**@type{boolean} */
    HasSupplyCenter;

    /**@type{string} */
    HomeCountry;

    //#endregion

    //#region Visual properties

    /**@type{string} */
    FullName;

    /**@type{number[]} */
    TextLocation;
    /**@type{number[]|null} */
    DotLocation = null;

    /**@type{Object.<string,number[]>} */
    UnitLocations = {};

    /**@type{Object.<string,string[]>} */
    Neighbors = {};

    /**@type{string} */
    BorderPath;
    /**@type{number[][]} */
    BorderPathPoints;

    /**@type{Object.<string,number[][]>} */
    CoastPaths = {};

    /**@type{number[]} */
    Canal = null;

    /**
     * 
     * @param {gmUnitWithLocation} uwl 
     * @returns 
     */
    GetLocationForUnit(uwl) {
        if (!uwl) throw "uwl cannot be null";
        if (uwl.Key in this.UnitLocations) return this.UnitLocations[uwl.Key];
        return [0, 0];
    }

    //#endregion

}

//#endregion

//#region MapData

class dbnMapData {

    constructor(json) {
        if ("Properties" in json) {
            var props = json["Properties"];
            if ("Label" in props) this.Label = props["Label"];
            if ("CornerRadius" in props) this.CornerRadius = props["CornerRadius"];
            if ("WaterColor" in props) this.WaterColor = props["WaterColor"];
            if ("CoastLines" in props) this.CoastLines = props["CoastLines"];
        }

        this.ProvinceData = {};
        if ("Provinces" in json) {
            Object.entries(json.Provinces).forEach(x => {
                var pd = new dbnProvinceData(x[0], x[1]);
                this.ProvinceData[x[0]] = pd;
            });
        }

        if (!this.CoastLines) this.CoastLines = this.#FindCoastlines();
        if (!this.AdjustmentLocations) this.AdjustmentLocations = this.#FindAdjustmentLocations();

        //NOTE: THIS MUST BE MOVED
        // this.ProvinceData["Kie"].Canal = [0.5, 10];
        // this.ProvinceData["Den"].Canal = [0, 11];
        // this.ProvinceData["Con"].Canal = [0.5, 5.5];
    }

    /**@type{string} */
    Label;

    /**@type{number} */
    CornerRadius;

    // /**@type{boolean} */
    // UseBackgroundMap;

    /**@type{Object.<string,dbnProvinceData>} - Keys are ProvinceEnum*/
    ProvinceData;

    /**@type{Object.<string,dbnPoint>} - Keys are CountryEnum*/
    AdjustmentLocations;

    /**@type{dbnPoint[]} */
    Canals;

    /**@type{number[][][]} */
    CoastLines;

    /** @type{number[]} */
    get NativeSize() {
        var x = 0;
        var y = 0;
        Object.values(this.ProvinceData).forEach(pd => { x = Math.max(x, pd.LowerRight[0]); y = Math.max(y, pd.LowerRight[1]); });
        //Canals.ForEachKV((k, v) => v.ForEach(xx => { x = Math.Max(x, xx.X); y = Math.Max(y, xx.Y); }));
        return [x, y];
    }

    //#region FindCoastlines

    #FindCoastlines() {

        var waters = Object.values(this.ProvinceData).filter(x => x.ProvinceType == ProvinceTypeEnum.Water);
        var lands = Object.values(this.ProvinceData).filter(x => x.ProvinceType == ProvinceTypeEnum.Land);

        /** @type{number[][][]} */
        var segments = [];
        var seg = [];

        lands.forEach(landp => {
            var lpath = landp.BorderPathPoints;
            waters.forEach(waterp => {
                var wpath = waterp.BorderPathPoints;
                lpath.forEach((lpt0, li0) => {
                    var lpt1 = lpath[li0 == lpath.length - 1 ? 0 : li0 + 1];
                    var bFound = false;
                    wpath.every((wpt0, wi0) => {
                        var wpt1 = wpath[wi0 == wpath.length - 1 ? 0 : wi0 + 1];
                        if (SegmentsAreEqual(lpt0, lpt1, wpt0, wpt1) || SegmentsAreEqual(lpt0, lpt1, wpt1, wpt0)) {
                            if (seg.length == 0) seg.push(lpt0);
                            seg.push(lpt1);
                            bFound = true;
                        }
                        return !bFound;
                    });
                    if (!bFound && seg.length != 0) { segments.push(seg); seg = []; }
                });
                if (seg.length != 0) { segments.push(seg); seg = []; }
            });
        });

        var ret = segments.slice();
        var matched = [];
        var i = 0;

        do {
            var previous = ret.slice();
            ret = [];
            matched = [];
            previous.forEach((seg0, i0) => {
                if (!matched.includes(i0)) {
                    previous.every((seg1, i1) => {
                        if (i1 > i0 && !matched.includes(i1)) {
                            if (PointsAreEqual(seg0[seg0.length - 1], seg1[0])) {
                                var newseg = seg0.slice();
                                newseg.push(...seg1.slice(1));
                                ret.push(newseg);
                                matched.push(i0, i1);
                                return false;
                            } else if (PointsAreEqual(seg0[0], seg1[seg1.length - 1])) {
                                var newseg = seg1.slice();
                                newseg.push(...seg0.slice(1));
                                ret.push(newseg);
                                matched.push(i0, i1);
                                return false;
                            } else if (PointsAreEqual(seg0[0], seg1[0])) {
                                var newseg = seg0.slice().reverse();
                                newseg.push(...seg1.slice(1));
                                ret.push(newseg);
                                matched.push(i0, i1);
                                return false;
                            } else if (PointsAreEqual(seg0[seg0.length - 1], seg1[seg1.length - 1])) {
                                var newseg = seg0.slice();
                                newseg.push(...seg1.reverse().slice(1));
                                ret.push(newseg);
                                matched.push(i0, i1);
                                return false;
                            }
                        }
                        return true;
                    });
                }
                if (!matched.includes(i0)) ret.push(seg0);
            });
            i++;
        } while (matched.length > 0 && i < 100);

        return ret;
    }

    //#endregion

    //#region FindAdjustmentLocations

    #FindAdjustmentLocations() {

        /**@type{Object.<string,dbnPoint>} */
        var ret = {};

        Object.entries(myGameModel.SupplyCentersByCountry).forEach(x => {
            var country = x[0];
            var provinces = x[1];
            var points = provinces.map(pp => dbnPoint.FromNumberArray(this.ProvinceData[pp].DotLocation));

            var pp = new dbnPoint(0, 0);
            points.forEach(x => pp = pp.AddTo(x));
            pp = pp.MultiplyBy(1 / points.length);

            ret[country] = pp;
        });

        Object.values(CountryEnum).forEach(country => {
            /**@type{string[]} */ var provinces;
            switch (country) {
                case CountryEnum.Austria: provinces = [ProvinceEnum.Ser, ProvinceEnum.Tri, ProvinceEnum.Bud]; break;
                case CountryEnum.England: provinces = [ProvinceEnum.Lvp, ProvinceEnum.IRI]; break;
                case CountryEnum.France: provinces = [ProvinceEnum.Par, ProvinceEnum.Mar]; break;
                case CountryEnum.Germany: provinces = [ProvinceEnum.Mun, ProvinceEnum.Kie, ProvinceEnum.Ruh]; break;
                case CountryEnum.Italy: provinces = [ProvinceEnum.Tus, ProvinceEnum.TYS]; break;
                case CountryEnum.Russia: provinces = [ProvinceEnum.Mos, ProvinceEnum.War]; break;
                case CountryEnum.Turkey: provinces = [ProvinceEnum.Arm, ProvinceEnum.Smy]; break;

                default:
                    break;
            }
            if (provinces) {
                var points = provinces.map(pp => {
                    var pd = this.ProvinceData[pp];
                    return dbnPoint.FromNumberArray(pd.GetLocationForUnit(pd.GetDefaultUnitWithLocation()));
                });

                var pp = new dbnPoint(0, 0);
                points.forEach(x => pp = pp.AddTo(x));
                pp = pp.MultiplyBy(1 / points.length);

                ret[country] = pp;
            }
        });

        return ret;
    }

    //#endregion
}

//#endregion

//#region MapView

class dbnMapView extends dbnSVG {

    constructor(parent = null) {
        super(parent);
        //this.domelement.setAttribute("preserveAspectRatio", "none");
        super.style = "background-color: white; user-select: none;";
        //this.SetSize(800, 600);

        this.#AddSVGDefinitions();

        this.MapData = new dbnMapData(myMapDataRawNEW);
    }

    //#region Events

    OnGameSet = new dbnEvent();
    OnGamePhaseSet = new dbnEvent();

    //#endregion

    //#region SVG Definitions

    #RetreatFillColor = "white";
    #RetreatStrokeColor = "orange";
    #SupportEndCap = "supportEndCap";

    #AddSVGDefinitions() {
        [true, false].forEach(succeeded => {
            var strokecolor = succeeded ? "black" : "red";

            //Support hold
            var marker = new dbnSVGMarker();
            marker.id = this.#SupportEndCap + succeeded;
            marker.MarkerWidth = 6; marker.MarkerHeight = 6;
            marker.RefX = 3; marker.RefY = 3;
            marker.AddPath("M 6 0 L3 3 L6 6", strokecolor, 1, "none");
            var line2 = marker.AddPath("M 6 0 L3 3 L6 6", "white", 0.25, "none");
            line2.strokeDashArray = "1,1";
            this.AddDef(marker);
        });
    }

    //#endregion

    /**@type{dbnMapData} */
    #MapData;
    get MapData() { return this.#MapData; }
    set MapData(value) {
        this.#MapData = value;
        var size = this.#MapData.NativeSize;
        this.domelement.setAttribute("viewBox", "0 0 " + size[0] + " " + size[1]);
    }

    /**@type{gmGame} */
    #Game;
    get Game() { return this.#Game; }
    set Game(value) { this.#Game = value; this.OnGameSet.Raise(); }

    /**@type{gmGamePhase} */
    #GamePhase;
    get GamePhase() { return this.#GamePhase; }
    set GamePhase(value) { this.#GamePhase = value; this.#Draw(); this.OnGamePhaseSet.Raise(); }

    ShowNavigationButtons = true;
    ViewingMode = GameViewingModeEnum.EverythingWithoutReveal;
    UnitSize = 15;

    //#region Navigation

    #AddNavigationButtons() {
        var pt = new dbnPoint(5, 35);
        var length = 20;
        var mm = 3;
        var linewidth = 4;
        var spacing = 3;
        var backcolor = "gray";

        //S01
        var btn = new dbnSVGButton(this);
        btn.BackColor = backcolor;
        btn.AddText("S01");
        btn.FitToContents(3, 1, -3, 1);
        btn.MoveTo(pt);
        btn.onclick = this.GoToFirstPhase.bind(this);
        btn.createAndAppendElement("title").AddText("Go to Spring 01");
        pt = pt.WithOffset(btn.getBBox().width + spacing, 0);

        //Previous
        btn = new dbnSVGButton(this);
        btn.BackColor = backcolor;
        var alin = new dbnSVGArrowPath(btn);
        alin.LineSegment = new dbnLineSegment([0, 0], [-length, 0]);
        alin.LineWidth = linewidth;
        btn.FitToContents(mm, mm, mm, mm);
        btn.MoveTo(pt);
        btn.onclick = this.GoToPreviousPhase.bind(this);
        btn.createAndAppendElement("title").AddText("Previous phase");
        pt = pt.WithOffset(btn.getBBox().width + spacing, 0);

        //Next
        btn = new dbnSVGButton(this);
        btn.BackColor = backcolor;
        alin = new dbnSVGArrowPath(btn);
        alin.LineSegment = new dbnLineSegment([0, 0], [length, 0]);
        alin.LineWidth = linewidth;
        btn.FitToContents(mm, mm, mm, mm);
        btn.MoveTo(pt);
        btn.onclick = this.GoToNextPhase.bind(this);
        btn.createAndAppendElement("title").AddText("Next phase");
        pt = pt.WithOffset(btn.getBBox().width + spacing, 0);

        //Last
        var btn = new dbnSVGButton(this);
        btn.BackColor = backcolor;
        btn.AddText(this.Game.GamePhases[this.Game.GamePhases.length - 1].PhaseTextShort);
        btn.FitToContents(3, 1, -3, 1);
        btn.MoveTo(pt);
        btn.onclick = this.GoToLastPhase.bind(this);
        btn.createAndAppendElement("title").AddText("Go to last");
        pt = pt.WithOffset(btn.getBBox().width + spacing, 0);
    }

    GoToFirstPhase() {
        if (!this.Game || this.Game.GamePhases.length == 0) return;
        this.GamePhase = this.Game.GamePhases[0];
    }
    GoToLastPhase() {
        if (!this.Game || this.Game.GamePhases.length == 0) return;
        this.GamePhase = this.Game.GamePhases[this.Game.GamePhases.length - 1];
    }

    GoToPreviousPhase() { this.#AdvancePhase(false); }
    GoToNextPhase() { this.#AdvancePhase(true); }

    #AdvancePhase(next = true) {
        if (!this.Game || this.Game.GamePhases.length == 0) return;

        if (!this.GamePhase) {
            this.GamePhase = this.Game.GamePhases[0];
            return;
        }

        var bFound = false;
        var previous;
        for (const gp of this.Game.GamePhases) {
            if (bFound && next) {
                this.GamePhase = gp;
                return;
            }
            if (gp.Phase == this.GamePhase.Phase) {
                bFound = true;
                if (!next) {
                    if (previous) this.GamePhase = previous;
                    return;
                }
            }
            previous = gp;
        }
    }

    //#endregion

    //#region Draw

    #Draw() {
        if (!this.MapData) return;

        this.innerHTML = "";

        // if (_MapScale == 0) return;
        // gr.Scale(_MapScale, _MapScale);
        // gr.AntiAlias = true;

        //if (!this.GamePhase) return;

        //Background
        var nsize = this.MapData.NativeSize;
        this.AddRectangle(0, 0, nsize[0], nsize[1], null, null, "black");

        // FillTerritories(gr);
        this.#DrawProvinces();

        if (this.ViewingMode != GameViewingModeEnum.ProvincesOnly) {
            this.#DrawProvinceLabels();
            this.#DrawSupplyCenters();

            if (this.ViewingMode != GameViewingModeEnum.ProvincesAndUnitsOnly) {
                if (this.GamePhase.Orders) this.#DrawOrders(["m", "c", "sh", "sm"]);
                if (this.GamePhase.RetreatOrders) this.#DrawOrders(["m"], true);
            }
            if (this.GamePhase.Units) this.#DrawUnits();
            if (this.ViewingMode != GameViewingModeEnum.ProvincesAndUnitsOnly) {
                if (this.GamePhase.Orders) { this.#DrawOrders(["d", "b", "h"]); }
                if (this.GamePhase.RetreatOrders) this.#DrawOrders(["d"], true);
            }

            if (this.GamePhase.Phase % 10 == 3) this.#DrawAdjustmentCounts();

            this.#DrawGameLabels();
            if (this.ShowNavigationButtons) this.#AddNavigationButtons();
        }

    }

    //#endregion

    //#region Provinces and labels

    #DrawGameLabels() {

        //Phase label
        this.AddText(this.GamePhase.PhaseTextLong, 5, 8, "Black", "font-weight: bold; font-size: 20px");

        if (this.GamePhase.Status == GamePhaseStatusEnum.GameEnded) {
            var xx = this.AddText("Game Over", 5, 60, "Red", "font-weight: bold; font-size: 30px");
            xx.stroke = "black";
        }
    }

    /**@type{Object.<string,dbnSVGPath>} */
    #ProvinceSVGs;

    #DrawProvinces() {
        var owners = this.GamePhase?.MakeSupplyCentersByProvince();
        var colors = myHub.ColorScheme;

        this.#ProvinceSVGs = {};

        Object.values(this.MapData.ProvinceData).forEach(x => {
            var fill;
            if (x.ProvinceType == ProvinceTypeEnum.Water) {
                fill = colors.WaterColor;
            } else {
                var owner = owners ? owners[x.Province] : null;
                fill = owner ? colors.CountryBackColors[owner] : colors.NeutralColor;
            }

            var provincesvg = this.AddPath(x.BorderPath, "black", "2", fill);
            this.#ProvinceSVGs[x.Province] = provincesvg;

            //Show orders on tooltip
            var orders = this.GamePhase.GetOrdersForProvince(x.Province);
            var orddiv = new dbnDiv();
            for (const country in orders) {
                orders[country].forEach(oar => {
                    var thisdiv = orddiv.addDiv();
                    thisdiv.style.padding = "2px 4px";
                    thisdiv.addText(oar.ToString());
                    thisdiv.style.backgroundColor = myHub.ColorScheme.CountryBackColors[country];
                    thisdiv.style.fontWeight = "bold";
                    thisdiv.style.color = "black";
                });
            }

            if (orddiv.domelement.childNodes.length == 0) {
                orddiv.addText(x.Province + " (no orders)");
                orddiv.style.padding = "2px 4px";
            }

            if (orddiv.domelement.childNodes.length > 0 && this.ViewingMode != GameViewingModeEnum.ProvincesOnly) {
                provincesvg.onmousemove = (e) => dbnSVGElement.ShowTooltip(e, orddiv);
                provincesvg.onmouseout = (e) => dbnSVGElement.HideTooltip();
            }

            if (this.ViewingMode != GameViewingModeEnum.ProvincesOnly && x.Canal && x.Canal.length == 2) {
                var pps = x.Canal.map(ptx => {
                    var frac = ptx - Math.floor(ptx);
                    var ptf = dbnPoint.FromNumberArray(x.BorderPathPoints[Math.floor(ptx)]).MultiplyBy(1 - frac);
                    var ptc = dbnPoint.FromNumberArray(x.BorderPathPoints[Math.ceil(ptx)]).MultiplyBy(frac);
                    return ptf.AddTo(ptc);
                });
                var segCanal = new dbnLineSegment(pps[0], pps[1]);
                var line1 = this.AddLineFromSegment(segCanal, "black", 5);
                line1.strokeDashArray = "1,1";
                line1.SetPointerEventsNone();

                var line2 = this.AddLineFromSegment(segCanal, colors.WaterColor, 3);
                line2.SetPointerEventsNone();
            }
        });
        // if (MapData.CornerRadius > 0) {
        //     MapData.FindAllTriplePoints().ForEach(x => gr.FillEllipse(Color.White, new RectangleF(x, new SizeF(0.75F * MapData.CornerRadius, 0.75F * MapData.CornerRadius)).WithNewCenterPoint(bfAlignmentEnum.MiddleCenter)));
        // }

        //CoastLines
        if (this.MapData.CoastLines) {
            this.MapData.CoastLines.forEach((x, i) => this.AddPath(dbnProvinceData.PathArrayToString(x, false), "black", 4, "none"));
        }
    }

    #DrawSupplyCenters() {
        Object.values(this.MapData.ProvinceData).filter(x => x.HasSupplyCenter).forEach(x => {
            var circle = this.AddCircle(x.DotLocation[0], x.DotLocation[1], 3);
            circle.SetPointerEventsNone();
        });
    }

    #DrawProvinceLabels() {
        Object.entries(this.MapData.ProvinceData).forEach(x => {
            var pd = x[1];
            var loc = pd.TextLocation;
            var text = this.AddText(x[0], loc[0], loc[1], null, "font-size:10px; ");
            text.SetVerticalAlignAuto();
            text.SetPointerEventsNone();
        });
    }

    //#endregion

    //#region  Units

    #DrawUnits() {
        if (!this.GamePhase) return;
        if (!this.GamePhase.Units) return;

        Object.entries(this.GamePhase.Units).forEach(x => {
            var country = x[0];
            x[1].forEach(uwl => {
                this.#DrawUnit(country, uwl);
            });
        });
    }

    // #FleetPoints = [[-this.UnitSize / 2, -this.UnitSize / 3], [this.UnitSize / 2, -this.UnitSize / 3], [0, this.UnitSize / 2]];
    #FleetPoints = [[-this.UnitSize / 1.6, 0], [0, -this.UnitSize / 1.5], [this.UnitSize / 1.6, 0], [0, this.UnitSize / 1.5]];

    /**
     * 
     * @param {string} country 
     * @param {gmUnitWithLocation} uwl 
     */
    #DrawUnit(country, uwl) {

        var color = myHub.ColorScheme.CountryColors[country];
        var innercolor = color;//+ "cc";

        var provdata = this.MapData.ProvinceData[uwl.Location.Province];

        if (provdata) {
            var loc = provdata.UnitLocations[uwl.Key];
            if (loc) {
                /**@type{dbnSVGElement} */ var unit;
                /**@type{dbnSVGElement} */ var back;
                switch (uwl.UnitType) {
                    case "A":
                        var rad = this.UnitSize / 2;
                        unit = this.AddCircle(loc[0], loc[1], rad, color, 4, innercolor);
                        back = this.AddCircle(loc[0], loc[1], rad, "black", 2, "none");
                        break;

                    case "F":
                        // this.AddPolygon(loc[0], loc[1], fleet, color, 4, innercolor);
                        // this.AddPolygon(loc[0], loc[1], fleet, "black", 2, "none");

                        unit = this.AddPolygon(loc[0], loc[1], this.#FleetPoints, color, 4, innercolor);
                        back = this.AddPolygon(loc[0], loc[1], this.#FleetPoints, "black", 2, "none");

                        // this.AddRectangle(loc[0] - this.UnitSize, loc[1], 2 * this.UnitSize, this.UnitSize, color, 4, color + "cc");
                        // this.AddRectangle(loc[0] - this.UnitSize, loc[1], 2 * this.UnitSize, this.UnitSize, "black", 2, "none");
                        // this.AddRectangle(loc[0] - this.UnitSize / 2, loc[1] - this.UnitSize, this.UnitSize, 2 * this.UnitSize, color, 4, color + "cc");
                        // this.AddRectangle(loc[0] - this.UnitSize / 2, loc[1] - this.UnitSize, this.UnitSize, 2 * this.UnitSize, "black", 2, "none");
                        break;
                    default: console.log("UNKNOWN UnitType: " + uwl.UnitType); break;
                }
                if (unit) {
                    unit.SetPointerEventsNone();
                    back.SetPointerEventsNone();
                }
            } else {
                console.log("LOCATION NOT FOUND: " + uwl.Key);
            }
        } else {
            console.log("PROVINCE NOT FOUND: " + uwl.Location.Province, uwl);
        }
    }

    //#endregion

    //#region Draw Orders

    #DrawOrders(ordertypeOrTypes, retreats = false) {
        if (Array.isArray(ordertypeOrTypes)) {
            ordertypeOrTypes.forEach(x => this.#DrawOrders(x, retreats));
            return;
        }

        if (typeof ordertypeOrTypes != "string") throw "ordertype must be a string";

        Object.entries(retreats ? this.GamePhase.RetreatOrders : this.GamePhase.Orders).forEach(x =>
            x[1].filter(x => x.Order.Type == ordertypeOrTypes).forEach(oar => this.#DrawOrder(x[0], oar, retreats))
        );
        if (ordertypeOrTypes == "sm") this.#DrawOrderSupportMoveCounts();
    }

    /**
     * 
     * @param {string} country 
     * @param {gmOrderAndResolution} oar 
     * @param {boolean} isretreat 
     */
    #DrawOrder(country, oar, isretreat = false) {
        var bShowWritten = false;

        switch (oar.Order.Type) {
            case "h": this.#DrawOrderHold(country, oar); break;
            case "m": this.#DrawOrderMove(country, oar, isretreat); break;

            case "sh":
                this.#DrawOrderSupportHold(country, oar);
                bShowWritten = true;
                break;

            case "sm":
                this.#DrawOrderSupportMove(country, oar);
                bShowWritten = true;
                break;

            case "c":
                this.#DrawOrderConvoy(country, oar);
                bShowWritten = true;
                break;

            // case GameModel.OrderConvoy cord:
            //     DrawOrderConvoy(gr, oar, cord);
            //     bShowWritten = true;
            //     break;

            case "b": this.#DrawOrderBuild(country, oar); break;
            case "d": this.#DrawOrderDisband(country, oar); break;

            default: break;
        }

        // if (ShowWrittenOrders & bShowWritten) {
        //     var font = uiFont.NewArial(8, uiFontStyle.Bold);
        //     var text = oar.Order.ToString();
        //     var sz = gr.MeasureText(text, font);
        //     var loc = MapData.ProvinceData[oar.Province].GetLocationForUnit(GamePhase.Data.GetUnitWithLocation(oar.Province));
        //     var col = country.GetCountryColor();
        //     gr.FillRectangle(col, new Rectangle(loc, sz.ToSize()).WithNewCenterPoint(bfAlignmentEnum.MiddleCenter));
        //     gr.DrawText(text, font, Color.White, loc.WithOffset(0, 1), bfAlignmentEnum.MiddleCenter);
        // }
    }

    /**
     * 
     * @param {string} country
     * @param {gmOrderAndResolution} oar 
     */
    #DrawOrderHold(country, oar) {
        var pd = this.MapData.ProvinceData[oar.Province];
        var uwl = this.GamePhase.GetUnitWithLocation(oar.Province) ?? pd.GetDefaultUnitWithLocation();
        var loc = pd.GetLocationForUnit(uwl);
        var text = this.AddText("H", loc[0] - 3.2, loc[1] + 3.3, "black", "font-size: 8px; font-weight: bold");
        text.SetVerticalAlignAuto();
        text.SetPointerEventsNone();
    }

    /**
     * 
     * @param {string} fromprovince 
     * @param {gmLocation} tolocation 
     */
    #GetMoveSegment(fromprovince, tolocation) {
        var pdFrom = this.MapData.ProvinceData[fromprovince];
        var pdTo = this.MapData.ProvinceData[tolocation.Province];

        var uwlFrom = this.GamePhase.GetUnitWithLocation(fromprovince) ?? pdFrom.GetDefaultUnitWithLocation();
        var uwlTo = tolocation.ToUnitWithLocation(uwlFrom.UnitType);

        var moveline = new dbnLineSegment(pdFrom.GetLocationForUnit(uwlFrom), pdTo.GetLocationForUnit(uwlTo));

        moveline = this.#ShortenMovement(moveline);
        return moveline;
    }

    #MoveLineWidth = 4;
    #MoveArrowsize = 2;
    #MoveArrowEndCapWidth = dbnSVGArrowPath.GetDefaultEndCapDimension(this.#MoveLineWidth, this.#MoveArrowsize);

    /**
     * 
     * @param {dbnLineSegment} line 
     * @returns 
     */
    #ShortenMovement(line) {
        var shorten = this.UnitSize * 0.6;
        //if (line.Length < 4 * shorten) shorten = 0.5 * (line.Length - 2 * shorten);
        if (line.Length < 3 * this.#MoveArrowEndCapWidth) shorten = 0;
        //shorten = 0;

        // if (shorten > 0) return line.WithNewLength(-shorten, -shorten);
        if (shorten > 0) return line.WithNewLength(0, -shorten);
        return line;
    }

    /**
     * 
     * @param {string} country
     * @param {gmOrderAndResolution} oar 
     * @param {boolean} isretreat 
     */
    #DrawOrderMove(country, oar, isretreat) {
        var order = oar.Order;
        if (!(order instanceof gmOrderMove)) throw "Not a valid move order";

        var line = this.#GetMoveSegment(oar.Province, order.ToLocation);

        var strokecolor = isretreat ? this.#RetreatStrokeColor : (oar.Result.Succeeded ? "black" : "red");
        var fillcolor = isretreat ? this.#RetreatFillColor : myHub.ColorScheme.CountryColors[country];

        // var arrowhead = this.#ArrowheadLabel + (isretreat ? "Retreat" : country + oar.Result.Succeeded);
        // this.AddLineFromSegment(line, strokecolor, 5, arrowhead);
        // this.AddLineFromSegment(line, fillcolor, 1.5);

        var arrow = new dbnSVGArrowPath(this);
        arrow.LineSegment = line;
        arrow.LineWidth = this.#MoveLineWidth;
        arrow.ArrowSize = this.#MoveArrowsize;
        arrow.stroke = strokecolor;
        arrow.strokeWidth = 2.25;
        arrow.fill = fillcolor;

        arrow.SetPointerEventsNone();
    }

    /**
    * 
    * @param {string} country
    * @param {gmOrderAndResolution} oar 
    */
    #DrawOrderSupportMove(country, oar) {
        var order = oar.Order;
        if (!(order instanceof gmOrderSupportMove)) throw "Not a valid support move order";

        var pdThis = this.MapData.ProvinceData[oar.Province];
        var uwlThis = this.GamePhase.GetUnitWithLocation(oar.Province) ?? pdThis.GetDefaultUnitWithLocation();
        var ptThis = dbnPoint.FromNumberArray(pdThis.GetLocationForUnit(uwlThis));

        var moveline = this.#GetMoveSegment(order.FromLocation.Province, order.ToLocation);
        var ptDest = moveline.GetInterimPoint(0.75);
        ptDest = moveline.WithNewLength(0, -this.#MoveArrowEndCapWidth).ToPoint;

        var color = oar.Result.Succeeded ? "black" : "red";

        var d = ptThis.ToPath("M") + moveline.FromPoint.ToPath("Q") + ptDest.ToPath("");
        var path = this.AddPath(d, color, 3, "none");
        path.SetPointerEventsNone();
        path = this.AddPath(d, "white", 1, "none");
        path.strokeDashArray = "5,5";
        path.SetPointerEventsNone();
    }

    #DrawOrderSupportMoveCounts() {
        var supports = {};
        return;

        Object.entries(this.GamePhase.Orders).forEach(x =>
            x[1].filter(x => x.Order.Type == "sm").forEach(oar => {
                var country = x[0];
                if (!(oar.Order instanceof gmOrderSupportMove)) return;
                var key = JSON.stringify(oar.Order.ToJSON());
                if (!(key in supports)) supports[key] = [];
                supports[key].push(country);
            }));

        Object.entries(supports).forEach(x => {
            var order = gmOrderSupportMove.FromJSON(JSON.parse(x[0]));
            /**@type{string[]} */
            var sups = x[1];
            var point = this.#GetMoveSegment(order.FromLocation.Province, order.ToLocation).MiddlePoint;
            this.AddCircle(point.X, point.Y, 8, null, null, "black");
            this.AddText(sups.length, point.X - 4, point.Y + 4, "white");
        });

    }

    /**
     * 
     * @param {string} country
     * @param {gmOrderAndResolution} oar 
     */
    #DrawOrderConvoy(country, oar) {
        var order = oar.Order;
        if (!(order instanceof gmOrderConvoy)) throw "Not a valid convoy order";

        var pdThis = this.MapData.ProvinceData[oar.Province];
        var uwlThis = this.GamePhase.GetUnitWithLocation(oar.Province) ?? pdThis.GetDefaultUnitWithLocation();
        var ptThis = dbnPoint.FromNumberArray(pdThis.GetLocationForUnit(uwlThis));

        var moveline = this.#GetMoveSegment(order.FromLocation.Province, order.ToLocation);
        var ptDest = moveline.MiddlePoint;

        var color = oar.Result.Succeeded ? "blue" : "red";

        var d = ptThis.ToPath("M") + moveline.FromPoint.ToPath("Q") + ptDest.ToPath("");
        var path = this.AddPath(d, color, 3, "none");
        path.SetPointerEventsNone();
        path = this.AddPath(d, "white", 1, "none");
        path.strokeDashArray = "10,5";
        path.SetPointerEventsNone();

        var circle = this.AddCircle(ptDest.X, ptDest.Y, 5, "none", 0, "blue");
        circle.SetPointerEventsNone();
    }

    /**
     * 
     * @param {string} country
     * @param {gmOrderAndResolution} oar 
     */
    #DrawOrderSupportHold(country, oar) {
        var order = oar.Order;
        if (!(order instanceof gmOrderSupportHold)) throw "Not a valid support hold order";

        var pdThis = this.MapData.ProvinceData[oar.Province];
        var uwlThis = this.GamePhase.GetUnitWithLocation(pdThis.Province) ?? pdThis.GetDefaultUnitWithLocation();

        var pdHold = this.MapData.ProvinceData[order.HoldLocation.Province];
        var uwlHold = this.GamePhase.GetUnitWithLocation(pdHold.Province) ?? pdHold.GetDefaultUnitWithLocation();

        var line = new dbnLineSegment(pdThis.GetLocationForUnit(uwlThis), pdHold.GetLocationForUnit(uwlHold));

        line = line.WithNewLength(0, -1.1 * this.UnitSize);

        var color = oar.Result.Succeeded ? "black" : "red";

        var svgline = this.AddLineFromSegment(line, color, 3);
        svgline.markerEnd = this.#SupportEndCap + oar.Result.Succeeded;
        svgline.SetPointerEventsNone();

        svgline = this.AddLineFromSegment(line, "white", 1);
        svgline.strokeDashArray = "2,2";
        svgline.SetPointerEventsNone();
    }

    /**
    * 
    * @param {string} country
    * @param {gmOrderAndResolution} oar 
    */
    #DrawOrderDisband(country, oar) {
        var order = oar.Order;
        if (!(order instanceof gmOrderDisband)) throw "Not a valid disband order";

        var pdThis = this.MapData.ProvinceData[oar.Province];
        var uwlThis = this.GamePhase.GetUnitWithLocation(pdThis.Province) ?? pdThis.GetDefaultUnitWithLocation();
        var location = pdThis.GetLocationForUnit(uwlThis);
        var pt = dbnPoint.FromNumberArray(location);

        var f = this.UnitSize / 1.5;
        var l1 = new dbnLineSegment(pt.WithOffset(f, f), pt.WithOffset(-f, -f));
        var l2 = new dbnLineSegment(pt.WithOffset(f, -f), pt.WithOffset(-f, f));

        /**@type{dbnSVGLine[]} */
        var lines = [];
        var thickness = 4;
        lines.push(this.AddLineFromSegment(l1, "black", thickness));
        lines.push(this.AddLineFromSegment(l2, "black", thickness));

        lines.push(this.AddLineFromSegment(l1.WithNewLength(-1, -1), "red", thickness / 2));
        lines.push(this.AddLineFromSegment(l2.WithNewLength(-1, -1), "red", thickness / 2));

        lines.forEach(x => x.SetPointerEventsNone());
    }

    /**
    * 
    * @param {string} country
    * @param {gmOrderAndResolution} oar 
    */
    #DrawOrderBuild(country, oar) {
        var order = oar.Order;
        if (!(order instanceof gmOrderBuild)) throw "Not a valid build order";

        var pdThis = this.MapData.ProvinceData[oar.Province];

        this.#DrawUnit(country, order.UnitWithLocation);

        var location = pdThis.GetLocationForUnit(order.UnitWithLocation);
        var pt = dbnPoint.FromNumberArray(location);

        var f = this.UnitSize * 0.9;

        var circ1 = this.AddCircle(pt.X, pt.Y, f, "black", 4, "none");
        circ1.SetPointerEventsNone();

        var circ2 = this.AddCircle(pt.X, pt.Y, f, "white", 1.5, "none");
        circ2.strokeDashArray = "2,3";
        circ2.SetPointerEventsNone();
    }

    //#endregion

    //#region Adjustment Counts

    #DrawAdjustmentCounts() {
        var n = 0;

        Object.values(CountryEnum).forEach(country => {
            var units = this.GamePhase.Units[country];
            if (!units) return;
            var cc = this.GamePhase.CenterCounts[country];
            if (!cc) return;
            if (units.length != cc) {
                var pt = this.MapData.AdjustmentLocations[country];
                var text = (cc > units.length ? "+" : "") + new String(cc - units.length);

                var circle = this.AddCircle(pt.X, pt.Y, 15, "black", 2, "white");
                circle.SetPointerEventsNone();

                var txt = this.AddText(text, pt.X, pt.Y, myHub.ColorScheme.CountryColors[country], "font-size: 20px; font-weight:bold;");
                txt.SetVerticalAlignMiddle();
                txt.SetHorizontalAlignMiddle();
                txt.SetPointerEventsNone();
                n++;
            }

        });
    }

    //#endregion

}

//#endregion

//#region Scoreboard

class dbnScoreboard extends dbnBaseTable {
    constructor(parent = null) {
        super(parent);
        this.domelement.classList.add("dbnScoreboard");
        this.#UpdateDisplay();
    }

    /**@type{gmGame} */
    #Game;
    get Game() { return this.#Game; }
    set Game(value) { this.#Game = value; this.GamePhase = null; }

    /**@type{gmGamePhase} */
    #GamePhase;
    get GamePhase() { return this.#GamePhase; }
    set GamePhase(value) { this.#GamePhase = value; this.#UpdateDisplay(); }

    #UpdateDisplay() {
        this.ClearBody();

        var lines = [];
        Object.values(CountryEnum).forEach((country, i) => {
            var line = [country];
            line.push((this.#Game && this.#Game.Players && country in this.#Game.Players) ? this.#Game.Players[country] : "-");

            let centercount = "-";
            let score = "---";

            if (this.GamePhase && this.GamePhase.Status == GamePhaseStatusEnum.GameEnded && this.Game && this.Game.ResultSummary && country in this.Game.ResultSummary) {
                var rl = this.Game.ResultSummary[country];
                centercount = rl.CenterCount; score = rl.Score;
            } else if (this.GamePhase && this.GamePhase.CenterCounts) {
                centercount = country in this.GamePhase.CenterCounts ? this.GamePhase.CenterCounts[country] : 0;
            }
            centercount = "(" + centercount + ")";
            //if (centercount.length == 3) centercount = "&nbsp;" + centercount + "&nbsp;";

            line.push(centercount, score);
            lines.push(line);

            var row = this.GetBodyRow(i);
            row.style.backgroundColor = myHub.ColorScheme.CountryBackColors[country];
        });
        this.LoadContent(lines);
    }

    /**@type{dbnMapView} */
    MapView;
    #MapViewGameSet() { this.Game = this.MapView.Game; }
    #MapViewGamePhaseSet() { this.GamePhase = this.MapView.GamePhase; }

    /**
     * 
     * @param {dbnMapView} mapview 
     */
    BindToMapView(mapview) {
        this.MapView = mapview;
        this.Game = mapview.Game;
        this.GamePhase = mapview.GamePhase;
        mapview.OnGameSet.AddListener(this.#MapViewGameSet.bind(this));
        mapview.OnGamePhaseSet.AddListener(this.#MapViewGamePhaseSet.bind(this));
    }

}

//#endregion