function findHeader(node){
    for (node = node.parentNode; node && !node.nodeName.startsWith("H"); node = node.previousSibling);
    return node;
}

function toggleHeader(node, hidden){
    node.hidden = hidden;
    for (node = node.nextSibling; node && !node.nodeName.startsWith("H"); node = node.nextSibling){
        node.hidden = hidden;
    }
}

function getTags(){
    return new Set([...document.querySelectorAll("span.hashtag")].map(elem=>elem.dataset.value));
}

function buildTagDatabase(){
	let result = new Map();
	getTags().forEach(tag=>{result.set(tag, [])});
	
	[...document.querySelectorAll("span.hashtag")].forEach(node=>{
		result.get(node.dataset.value).push(findHeader(node));		
	});

	console.log(result);
	return result;
}

function toggleHeaderByTag(tagDatabase, tag, hidden){
	tagDatabase.get(tag).forEach(node=>{
		toggleHeader(node, hidden);
	});
}
