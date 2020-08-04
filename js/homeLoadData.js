(function () {
    handleClientLoad();
})();

/**
 *  Load the API client library
 */
function handleClientLoad() {
    gapi.load('client', initClient);
}

/**
 *  Initialize the API client library
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        getInventory();
    }, function(error) {
        console.error(JSON.stringify(error, null, 2));
    });
}

function getInventory() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Item Inventory!A2:D'
    }).then(function(response) {
        var range = response.result;

        addMenuItems(range);
    }, function(response) {
        console.error('Error: ' + response.result.error.message);
    });
}

function addMenuItems(inventory) {
    var sourceNormal = document.getElementById("item-template").innerHTML;
    var templateNormal = Handlebars.compile(sourceNormal);
    var sourceSpecial = document.getElementById("item-special-template").innerHTML;
    var templateSpecial = Handlebars.compile(sourceSpecial);
    var menuCategories = { "Appetizer": [], "Lunch": [], "Dinner": [], "Cocktail": [] };

    for (i = 0; i < inventory.values.length; i++) {
        var row = inventory.values[i];
        var itemCategory = row[3];

        menuCategories[itemCategory].push(row);
    }

    var divSelector, divIdPrefix, html;

    for (var category in menuCategories) {
        var menuItems = menuCategories[category];
        var numItems = menuItems.length;

        for (var i = 0; i < numItems; i++) {
            var row = menuItems[i];
            var context = {itemName: row[0], itemDescription: row[1], itemPrice: row[2]};

            if (((i % 2 === 0) && i < numItems / 2) || (i % 2 === 1) && i >= numItems / 2) {
                html = templateNormal(context);
            } else {
                html = templateSpecial(context);
            }

            divIdPrefix = "#" + category.toLowerCase();

            if (i < numItems / 2) {
                divSelector = $(divIdPrefix + "-col1");
            } else {
                divSelector = $(divIdPrefix + "-col2");
            }

            divSelector.append(html);
        }
    }
}
