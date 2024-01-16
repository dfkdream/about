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

	return result;
}

function toggleHeaderByTag(tagDatabase, tag, hidden){
	tagDatabase.get(tag).forEach(node=>{
		toggleHeader(node, hidden);
	});
}

function appendCheckbox(fragment, id, name, value){
		let checkbox = document.createElement("input");
		checkbox.setAttribute("id", id);
		checkbox.setAttribute("name", name);
		checkbox.setAttribute("value", id);
		checkbox.setAttribute("type", "radio");
		checkbox.setAttribute("class", "hashtag");
		fragment.appendChild(checkbox);

		let label = document.createElement("label")
		label.setAttribute("for", id);
		label.setAttribute("class", "hashtag");
		label.textContent = value;
		fragment.appendChild(label);

		fragment.appendChild(document.createTextNode(" "));

		return checkbox;
}

class HashtagManager{
	constructor(){
		this.container = document.getElementById("filter-by-hashtag")
		this.tagDatabase = buildTagDatabase();
		this.opened = new Set([...document.querySelectorAll("h2")]);
		this.closed = new Set();

		let fragment = new DocumentFragment();
		appendCheckbox(fragment, "show_all", "filter-by-hashtag-value", "모두 보기").checked = true;
		this.tagDatabase.forEach((value, key)=>{
			let cb = appendCheckbox(fragment, key, "filter-by-hashtag-value", key);

			[...document.querySelectorAll(`span.hashtag[data-value="${key}"]`)].forEach(node=>{
				node.onclick = ()=>cb.click();
			});
		});

		this.container.appendChild(fragment);

		this.container.onchange = e=>{
			let value = e.target.value;
			if (value==="show_all") this.revealAll();
			else this.revealTag(value);
		}
	}

	revealAll(){
		this.closed.forEach(node=>{
			toggleHeader(node, false);
			this.opened.add(node);
		});
		this.closed.clear(); 
	}

	revealTag(tag){
		let headers = this.tagDatabase.get(tag);

		let headersToClose = [...this.opened].filter(v=>!headers.includes(v));
		let headersToReveal = [...this.closed].filter(v=>headers.includes(v));

		headersToClose.forEach(header=>{
			toggleHeader(header, true);
			this.opened.delete(header);
			this.closed.add(header);
		});

		headersToReveal.forEach(header=>{
			toggleHeader(header, false);
			this.closed.delete(header);
			this.opened.add(header);
		});
	}
}

window.onload = ()=>{
	new HashtagManager();
};