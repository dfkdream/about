function findHeader(node){
    for (node = node.parentNode; node && !node.nodeName.startsWith("H"); node = node.previousSibling);
    console.log(node);
}

function toggleHeader(node, hidden){
    node.hidden = hidden;
    for (node = node.nextSibling; node && !node.nodeName.startsWith("H"); node = node.nextSibling){
        node.hidden = hidden;
    }
}

function getTags(){
    return new Map([...document.querySelectorAll("span.hashtag")].map(elem=>elem.dataset.value));
}