insertTags = function (){
    var tags = [];
    var tagsVal = $('input[name=tags]').val();
    if (tagsVal){
        tagsSimple = tagsVal.split(",");

        tagsSimple.forEach(function(element, index, array) { 
            var tag = $.trim(element).toLowerCase();
            var id = tag.replace(" ", "-", "gi");
            var tagObj = {_id: id, name: tag};
            Meteor.call('tagInsert', tagObj, function(error, result){
                if(error) {
                    throwError(error.reason);
                }
                
            });
            
            if(tag = Tags.findOne(id)){
                tags.push(tag);
            }

            id = "";
            
        });                
    }


    return tags;
}        