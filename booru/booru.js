const got = require('got');

let permArr = [];
let usedChars = [];

function permute(input) {
    let i, ch;
    for (i = 0; i < input.length; i++) {
        ch = input.splice(i, 1)[0];
        usedChars.push(ch);
        if (input.length == 0) {
            permArr.push(usedChars.slice());
        }
        permute(input);
        input.splice(i, 0, ch);
        usedChars.pop();
    }
    return permArr;
};

function isTagContainsBanWords(bannedParts, name) {
    let check = false;
    bannedParts.forEach(blacklistedWord => {
        if(name.includes(blacklistedWord)) check = true;
    });
    return !check;
}

async function getTags(input, bannedParts) {
    let promises = [];
    let result = [];
    permArr.splice(0, permArr.length);
    usedChars.splice(0, usedChars.length);
    const combinationsOfTags = permute(input);

    combinationsOfTags.forEach(comb => {
        if(comb.length > 0) {
            let params = "*";
            comb.forEach(tag => {
                params += tag;
                params += "*";
            });
            let prom = fetchBooruAPI('tags.json?search[name_matches]=' + params + '&limit=150');
            prom.then(data => {
                data
                    .filter(x => x.post_count > 0)
                    .filter(x => isTagContainsBanWords(bannedParts, x.name))
                    .map(x => result.push(x));
            });
            promises.push(prom);
        }
    });
    await Promise.all(promises);
    return result;
}

async function fetchBooruAPI(params) {
    const response = await got('https://safebooru.donmai.us/' + params);
    return JSON.parse(response.body);
}

module.exports = {
	async getPost(input, bannedParts) {
        let result = {};
        const possibleTags = await getTags(input, bannedParts);
        if(possibleTags.length > 0) {
            const rndNum = Math.floor(Math.random() * possibleTags.length);
    
            await fetchBooruAPI('posts.json?tags=' + possibleTags[rndNum].name + '&random=true&limit=1').then(data => {
                result = data[0];
            });

            if(!result) {
                return { error: "Error, tag was found, but no posts matching it" };
            }

            return {
                ...result,
                usersTagUsedForSearching: possibleTags[rndNum].name
            };
        } else {
            return {
                error: "Error, no tags were found matching the specified criteria"
            };
        }
    }
}