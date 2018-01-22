module.exports = {
	shortenUrl,
	findUrl
}

function shortenUrl(req, res){
	let url = req.body.url;
	if(!url){
		return res.send("Empty Url");
	}
	shortenFunction(url).then(hashedUrl => {
		res.send(hashedUrl);
	})
	.catch(error => res.send(error.message))
}

async function shortenFunction(url){
	let hashedUrl = generateString();
	let isExists = await isHashExists(hashedUrl);
	if(isExists){
		await shortenFunction(url);
	}
	return await insertUrl(url, hashedUrl);
}
function generateString(){
	let possibleChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	let text = "";
	for(let i=0;i<6;i++){
		text+= possibleChar.charAt(Math.floor(Math.random()*possibleChar.length));
	}
	return text;
}
function isHashExists(val){
	return new Promise((resolve, reject) => {
		db.collection('urlinfo').find({hash: val}).toArray((error, result) =>{
			if(error){
				return reject(error);
			}
			if(Array.isArray(result) && result.length){
				return resolve(1);
			}
			return resolve(0);
		})
	})
}
function insertUrl(url, hashedUrl){
	return new Promise((resolve, reject) => {
		db.collection('urlinfo').insert({
			hash : hashedUrl,
			url : url
		}, (error, result) => {
			if(error){
				return reject(error);
			}
			return resolve(hashedUrl);
		});
	})
}

function findUrl(req, res){
	let hashedUrl = req.params.url;
	if(!hashedUrl){
		return res.send("invalid url");
	}
	fetchUrl(hashedUrl).then(result => {
		res.redirect(result[0].url)})
	.catch(error => res.send(error.message));
}
async function fetchUrl(hashedUrl){
	return await urlFetch(hashedUrl);
};
function urlFetch(url){
	return new Promise((resolve, reject) => {
		db.collection('urlinfo').find({hash : url},{url:1,_id:0}).toArray((error, result) => {
			if(error){
				return reject(error);
			}
			return resolve(result);
		})
	})
}