module.exports = function(app) {

    var Internal = {}
    var Query = {};

    Query.defaultParams = {}

    Internal.getRegionFilter = function(filterRegion) {

        var regionsFilter = filterRegion

        if (!regionsFilter) {
            regionsFilter = 'WHERE 1=1';
        } else {
            regionsFilter = 'WHERE ' + regionsFilter;
        }

        return regionsFilter
    }

    Internal.getYearFilter = function(paramYear) {
        var year = paramYear

        if (year) {
            year = ''
        } else {
            year = ' AND ' + year
        }

        return year;
    }

    Query.lulc = function(params) {

        var regionFilter = Internal.getRegionFilter(params['filterRegion']);

        return [{
                source: 'lapig',
                id: 'uso_solo_terraclass',
                sql: "SELECT a.classe as label, b.color, sum(a.area_ha) as value, (SELECT SUM(pol_ha) FROM regions " + regionFilter + ") as area_mun FROM uso_solo_terraclass as A INNER JOIN graphic_colors as B on a.classe = b.name AND b.table_rel = 'uso_solo_terraclass' " + regionFilter + " GROUP BY 1,2 ORDER BY 3 DESC",
                mantain: true
            },
            {
                source: 'lapig',
                id: 'uso_solo_probio',
                sql: "SELECT a.classe as label, b.color, sum(a.area_ha) as value, (SELECT SUM(pol_ha) FROM regions " + regionFilter + ") as area_mun FROM uso_solo_probio as A INNER JOIN graphic_colors as B on a.classe = b.name AND b.table_rel = 'uso_solo_probio' " + regionFilter + " GROUP BY 1,2 ORDER BY 3 DESC",
                mantain: true
            },
            // {
            //     id: 'uso_solo_mapbiomas',
            //     sql: "SELECT b.name as label, b.color, sum(a.area_ha) as value, (SELECT SUM(pol_ha) FROM regions " + tableRegionsFilter + ") as area_mun, year FROM uso_solo_mapbiomas as A INNER JOIN graphic_colors as B on a.classe = b.class_number AND b.table_rel = 'uso_solo_mapbiomas' " + regionsFilter + " " + year + " GROUP BY 1,2,5 ORDER BY 3 DESC",
            //     mantain: true
            // }
        ];
    }

    Query.deforestation = function(params) {

        var regionFilter = Internal.getRegionFilter(params['filterRegion']);

        console.log(regionFilter)

        return [{
            source: 'lapig',
            id: 'prodes',
            sql: " SELECT year, 'prodes_cerrado' source, SUM(pol_ha) as area_desmat_ha " +
                " FROM desmatamento_prodes " +
                regionFilter + " AND year IS NOT NULL" +
                " GROUP BY 1;",
            mantain: true
        }]

    }



    return Query;

}