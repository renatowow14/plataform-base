module.exports = function(app) {

    var Internal = {}
    var Query = {};

    Query.defaultParams = {}

    Query.lulc = function(params) {
        var regionsFilter = params['filterRegion']
        var tableRegionsFilter = "WHERE bioma='CERRADO'"
        var year = params["year"]

        if (regionsFilter != '' && regionsFilter != undefined) {
            tableRegionsFilter = tableRegionsFilter + " AND " + regionsFilter;
            regionsFilter = 'WHERE ' + regionsFilter;
        } else {
            regionsFilter = '';
        }

        if (year != undefined) {
            year = ' AND ' + year
        } else {
            year = ''
        }

        return [{
                source: 'lapig',
                id: 'uso_solo_terraclass',
                sql: "SELECT a.classe as label, b.color, sum(a.area_ha) as value, (SELECT SUM(pol_ha) FROM regions " + tableRegionsFilter + ") as area_mun FROM uso_solo_terraclass as A INNER JOIN graphic_colors as B on a.classe = b.name AND b.table_rel = 'uso_solo_terraclass' " + regionsFilter + " GROUP BY 1,2 ORDER BY 3 DESC",
                mantain: true
            },
            {
                source: 'lapig',
                id: 'uso_solo_probio',
                sql: "SELECT a.classe as label, b.color, sum(a.area_ha) as value, (SELECT SUM(pol_ha) FROM regions " + tableRegionsFilter + ") as area_mun FROM uso_solo_probio as A INNER JOIN graphic_colors as B on a.classe = b.name AND b.table_rel = 'uso_solo_probio' " + regionsFilter + " GROUP BY 1,2 ORDER BY 3 DESC",
                mantain: true
            },
            {
                source: 'lapig',
                id: 'agricultura_agrosatelite',
                sql: "SELECT a.year as label, a.classe, b.color, sum(a.area_ha) as value, (SELECT SUM(pol_ha) FROM regions " + tableRegionsFilter + ") as area_mun FROM agricultura_agrosatelite as A INNER JOIN graphic_colors as B on a.classe = b.name AND b.table_rel = 'agricultura_agrosatelite' " + tableRegionsFilter + " GROUP BY 1,2,3 ORDER BY 3 DESC",
                mantain: true
            },
            // {
            //     id: 'uso_solo_mapbiomas',
            //     sql: "SELECT b.name as label, b.color, sum(a.area_ha) as value, (SELECT SUM(pol_ha) FROM regions " + tableRegionsFilter + ") as area_mun, year FROM uso_solo_mapbiomas as A INNER JOIN graphic_colors as B on a.classe = b.class_number AND b.table_rel = 'uso_solo_mapbiomas' " + regionsFilter + " " + year + " GROUP BY 1,2,5 ORDER BY 3 DESC",
            //     mantain: true
            // }
        ];
    }

    return Query;

}