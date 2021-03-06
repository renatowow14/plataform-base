module.exports = function (app) {

    var Internal = {}
    var Query = {};

    Query.defaultParams = {}

    Internal.getRegionFilter = function (type, key) {

        var regionsFilter;

        if (type == 'country') {
            regionsFilter = 'WHERE 1=1';
        } else {
            var regionsFilter = "WHERE ";
            if (type == 'city')
                regionsFilter += "cd_geocmu = '" + key + "'"
            else if (type == 'state')
                regionsFilter += "uf = '" + key + "'"
            else if (type == 'biome')
                regionsFilter += "bioma = '" + key.toUpperCase() + "'"
            else if (type == 'fronteira') {
                if (key == 'amz_legal') {
                    regionsFilter += "amaz_legal = 1"
                }
                else if (key.toLowerCase() == 'MATOPIBA'.toLowerCase()) {
                    regionsFilter += "matopiba = 1"
                }
                else if (key.toLowerCase() == 'ARCODESMAT'.toLowerCase()) {
                    regionsFilter += "arcodesmat = 1"
                }
            }
        }

        return regionsFilter
    }

    Internal.getYearFilter = function (year) {

        if (year) {
            year = "year IS NOT NULL"
        } else {
            year = "year = " + Integer.parseInt(year)
        }

        return year;
    }

    Query.deforestation = function (params) {

        var regionFilter = Internal.getRegionFilter(params['typeRegion'], params['valueRegion']);
        // var yearFilter = Internal.getYearFilter(params['year']);

        return [{
            source: 'lapig',
            id: 'prodes',
            sql: " SELECT year as label, 'prodes_cerrado' source, CAST(SUM(pol_ha) / 1000 as double precision) as value, (SELECT CAST(SUM(pol_ha) / 1000 as double precision) FROM regions " + regionFilter + ") as area_mun " +
                " FROM desmatamento_prodes " +
                regionFilter +
                // " AND " + yearFilter +
                " GROUP BY 1;",
            mantain: true
        }]

    }

    Query.lulc = function (params) {

        var regionFilter = Internal.getRegionFilter(params['typeRegion'], params['valueRegion']);

        return [{
            source: 'lapig',
            id: 'uso_solo_terraclass',
            sql: "SELECT a.classe as label, b.color, sum(a.area_ha) as value, (SELECT CAST(SUM(pol_ha) as double precision) FROM regions " + regionFilter + ") as area_mun FROM uso_solo_terraclass as A INNER JOIN graphic_colors as B on a.classe = b.name AND b.table_rel = 'uso_solo_terraclass' " + regionFilter + " GROUP BY 1,2 ORDER BY 3 DESC",
            mantain: true
        },
        {
            source: 'lapig',
            id: 'uso_solo_probio',
            sql: "SELECT a.classe as label, b.color, sum(a.area_ha) as value, (SELECT CAST(SUM(pol_ha) as double precision) FROM regions " + regionFilter + ") as area_mun FROM uso_solo_probio as A INNER JOIN graphic_colors as B on a.classe = b.name AND b.table_rel = 'uso_solo_probio' " + regionFilter + " GROUP BY 1,2 ORDER BY 3 DESC",
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