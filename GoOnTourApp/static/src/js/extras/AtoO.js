var list = [
	{id: 1, first_name: "eric", last_name: "foster"}, {id: 2, first_name: "jo bob", last_name: "pierce"}, {id: 3, first_name: "brian", last_name: "shreckinger"}
]

function arrayToObject(list) {
	var object = {};
	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item["id"].toString();
		object[id] = item;
		delete item.id;
	}
	return object;
};

arrayToObject(list);

 var original = [
        {id: 123, name: "Kevin", dob: "1/1/2011"},
        {id: 456, name: "Bob", dob: "2/2/2012"}
    ];

    var desired = {
        123: {name: "Kevin", dob: "1/1/2011"},
        456: {name: "Bob", dob: "1/1/2011"}
    };

    //This version modifies the original object
    function arrayToObjectDestructive(inputArray) {

        //initialze empty output object
        var outputObject = {};

        //Loop through list indexes
        for (var i = 0; i < inputArray.length; i++) {
            //pull one item off using index
            var item = inputArray[i];

            //copy id before removing it!
            var id = item["id"].toString();

            // using id as the key; add item to output object
            outputObject[id] = item;

            //remove id from object
            delete item.id;
        }
        return outputObject;
    }

    arrayToObjectDestructive(original);
