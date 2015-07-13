/* global colorbrewer */

/**
 * @ngdoc service
 * @module lcaApp.colorCode.service
 * @name ColorCodeService
 * @memberOf lcaApp
 * @description
 * Factory service. Maps resource values to colorbrewer color scale
 */
angular.module('lcaApp.colorCode.service',
    [])
    .constant('IMPACT_CATEGORY_COLORS',
    {
        1: colorbrewer.Purples,  // Abiotic resource depletion
        2: colorbrewer.YlGn,     // Acidification
        3: colorbrewer.GnBu,     // Aquatic eco-toxicity
        4: colorbrewer.Greens,     // Aquatic Eutrophication
        5: colorbrewer.YlOrBr,   // Biotic resource depletion
        6: colorbrewer.Reds,     // Cancer human health effects
        7: colorbrewer.YlOrRd,    // Climate change
        8: colorbrewer.Blues,   // Ionizing radiation
        9: colorbrewer.YlOrBr,   // Land use
        10: colorbrewer.BuGn,     // Non-cancer human health effects
        11: colorbrewer.PuBuGn,   // Ozone depletion
        12: colorbrewer.YlGnBu,    // Photochemical ozone creation }
        13: colorbrewer.Greys,    // Respiratory inorganics
        14: colorbrewer.Greens    // Terrestrial Eutrophication
    })
    .constant('FRAGMENT_NODE_TYPE_COLORS',
    {
        Fragment: colorbrewer.Set2[3][0],
        InputOutput: colorbrewer.Set2[3][1],
        Process: colorbrewer.Set2[3][2]
    })
    .constant('FRAGMENT_FLOW_COLORS',
    {
        positive : colorbrewer.Set2[8][6], negative : colorbrewer.Set2[8][7]
    })
    .factory('ColorCodeService', ['IMPACT_CATEGORY_COLORS',
        function (IMPACT_CATEGORY_COLORS) {
            var svc = {};
            /**
             * @ngdoc
             * @name ColorCodeService#getImpactCategoryColors
             * @methodOf ColorCodeService
             * @description
             * Get color scale for impact category
             *
             * @param {number} impactCategoryID impact category ID
             * @returns {object} colorbrewer property
             */
            svc.getImpactCategoryColors = function (impactCategoryID) {
                if (impactCategoryID in IMPACT_CATEGORY_COLORS) {
                    return IMPACT_CATEGORY_COLORS[impactCategoryID];
                }
            };
            return svc;
        }]
);