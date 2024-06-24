const baseUrl = 'http://localhost:3030';

let user={
    username:'',
    email:'',
    password:'123456',
    gender:'male'
};
let token ='';
let userId='';

let meme={
    title:'',
    description:'',
    imageUrl: '/images/2.png'
};

let lastcreatedMemeId='';

QUnit.config.reorder=false;

QUnit.module ("User functionalities", ()=>{
    QUnit.test("User registration", async(assert)=>{
let path ='/users/register';
let random = Math.floor(Math.random()*10000);
let randomUserName = `Auto_Test_User_${random}`;
let randomEmail =`abv${random}@abv.bg`;
user.username=randomUserName;
user.email=randomEmail;

let response = await fetch(baseUrl+path, {
    method:'POST',
    headers: {'content-type' : 'application/json'},
    body: JSON.stringify(user)
});
assert.ok(response.ok, 'successful response');
let jsonResponse = await response.json();
console.log (jsonResponse);

assert.ok(jsonResponse.hasOwnProperty('email'), 'emails exists');
assert.equal(jsonResponse['email'], user.email, 'expected email');
assert.strictEqual(typeof jsonResponse.email, 'string', 'Email value is a string');

assert.ok(jsonResponse.hasOwnProperty('username'), 'username exists');
assert.equal(jsonResponse['username'], user.username, 'expected username');
assert.strictEqual(typeof jsonResponse.username, 'string', 'username value is a string');

assert.ok(jsonResponse.hasOwnProperty('password'), 'password exists');
assert.equal(jsonResponse['password'], user.password, 'expected password');
assert.strictEqual(typeof jsonResponse.password, 'string', 'password value is a string');

assert.ok(jsonResponse.hasOwnProperty('gender'), 'gender exists');
assert.equal(jsonResponse['gender'], user.gender, 'expected gender');
assert.strictEqual(typeof jsonResponse.gender, 'string', 'gender value is a string');

assert.ok(jsonResponse.hasOwnProperty('_id'), 'id exists');
assert.strictEqual(typeof jsonResponse._id, 'string', 'id value is a string');

assert.ok(jsonResponse.hasOwnProperty('accessToken'), 'access token exists');
assert.strictEqual(typeof jsonResponse.accessToken, 'string', 'access token value is a string');

token =jsonResponse.accessToken;
userId=jsonResponse._id;
sessionStorage.setItem('meme-user', JSON.stringify(user));
    });


    QUnit.test("User Login", async(assert)=>{
let path ='/users/login';
let response = await fetch(baseUrl+path, {
    method:'POST',
    headers: {'content-type' : 'application/json'},
    body: JSON.stringify({
        email:user.email,
        password: user.password
})
});
assert.ok(response.ok, 'successful response');
let jsonResponse = await response.json();
console.log (jsonResponse);

assert.ok(jsonResponse.hasOwnProperty('email'), 'emails exists');
assert.equal(jsonResponse['email'], user.email, 'expected email');
assert.strictEqual(typeof jsonResponse.email, 'string', 'Email value is a string');

assert.ok(jsonResponse.hasOwnProperty('username'), 'username exists');
assert.equal(jsonResponse['username'], user.username, 'expected username');
assert.strictEqual(typeof jsonResponse.username, 'string', 'username value is a string');

assert.ok(jsonResponse.hasOwnProperty('password'), 'password exists');
assert.equal(jsonResponse['password'], user.password, 'expected password');
assert.strictEqual(typeof jsonResponse.password, 'string', 'password value is a string');

assert.ok(jsonResponse.hasOwnProperty('gender'), 'gender exists');
assert.equal(jsonResponse['gender'], user.gender, 'expected gender');
assert.strictEqual(typeof jsonResponse.gender, 'string', 'gender value is a string');

assert.ok(jsonResponse.hasOwnProperty('_id'), 'id exists');
assert.strictEqual(typeof jsonResponse._id, 'string', 'id value is a string');

assert.ok(jsonResponse.hasOwnProperty('accessToken'), 'access token exists');
assert.strictEqual(typeof jsonResponse.accessToken, 'string', 'access token value is a string');

token =jsonResponse.accessToken;
userId=jsonResponse._id;
sessionStorage.setItem('meme-user', JSON.stringify(user));

    });
   
});

QUnit.module ("Meme functionalities", ()=>{
    QUnit.test("Get all memes", async(assert)=>{
let path = '/data/memes';
let queryParam = '?sortBy=_createdOn%20desc';

let response =await fetch(baseUrl+path+queryParam);

assert.ok(response.ok, 'successful response');
let jsonResponse = await response.json();
console.log (jsonResponse);

assert.ok(Array.isArray(jsonResponse), "response is an array");

jsonResponse.forEach(element=>{
    assert.ok(element.hasOwnProperty('description'), 'description exist');
    assert.strictEqual(typeof element.description, 'string', 'description is a string'); 

    assert.ok(element.hasOwnProperty('imageUrl'), 'imageUrl exist');
    assert.strictEqual(typeof element.imageUrl, 'string', 'imageUrl is a string'); 

    assert.ok(element.hasOwnProperty('title'), 'title exist');
    assert.strictEqual(typeof element.title, 'string', 'title is a string'); 

    assert.ok(element.hasOwnProperty('_createdOn'), 'createdon exist');
    assert.strictEqual(typeof element._createdOn, 'number', 'createdon is a number'); 

    assert.ok(element.hasOwnProperty('_id'), 'id exist');
    assert.strictEqual(typeof element._id, 'string', 'id is a string'); 

    assert.ok(element.hasOwnProperty('_ownerId'), 'owner id exist');
    assert.strictEqual(typeof element._ownerId, 'string', 'owner id is a string'); 
})
});
    });

    QUnit.test("Create meme", async(assert)=>{
let path = '/data/meme';
let random = Math.floor(Math.random()*10000);
meme.title= `Random_title${random}`;
meme.description =`Random_description${random}`;

let response = await fetch(baseUrl+path, {
    method: "Post",
    headers: {
        'content-type' : 'application/json',
        'X-Authorization' : token 
    },
        body: JSON.stringify(meme)
});
assert.ok(response.ok, 'successful response');
let jsonResponse= await response.json();
console.log (jsonResponse);

assert.ok(jsonResponse.hasOwnProperty('description'), 'description exist');
assert.equal(jsonResponse.description, meme.description, 'description is as expected');
    assert.strictEqual(typeof jsonResponse.description, 'string', 'description is a string'); 

    assert.ok(jsonResponse.hasOwnProperty('imageUrl'), 'imageUrl exist');
    assert.equal(jsonResponse.imageUrl, meme.imageUrl, 'imageUrl is as expected');
    assert.strictEqual(typeof jsonResponse.imageUrl, 'string', 'imageUrl is a string'); 

    assert.ok(jsonResponse.hasOwnProperty('title'), 'title exist');
    assert.equal(jsonResponse.title, meme.title, 'title is as expected');
    assert.strictEqual(typeof jsonResponse.title, 'string', 'title is a string'); 

    assert.ok(jsonResponse.hasOwnProperty('_createdOn'), 'createdon exist');
    assert.strictEqual(typeof jsonResponse._createdOn, 'number', 'createdon is a number'); 

    assert.ok(jsonResponse.hasOwnProperty('_id'), 'id exist');
    assert.strictEqual(typeof jsonResponse._id, 'string', 'id is a string'); 

    assert.ok(jsonResponse.hasOwnProperty('_ownerId'), 'owner id exist');
    assert.strictEqual(typeof jsonResponse._ownerId, 'string', 'owner id is a string'); 

    lastcreatedMemeId=jsonResponse._id;

    });
    QUnit.test("Edit meme", async(assert)=>{
        let path = '/data/meme';
        let random = Math.floor(Math.random()*10000);
meme.title= `Edit_Random_title${random}`;
        

        let response = await fetch(baseUrl+path +`/${lastcreatedMemeId}`, {
            method: "PUT",
            headers: {
                'content-type' : 'application/json',
                'X-Authorization' : token 
            },
                body: JSON.stringify(meme)
        });
        assert.ok(response.ok, 'successful response');
        let jsonResponse= await response.json();
        console.log (jsonResponse);
        lastcreatedMemeId=jsonResponse._id;
    });
    QUnit.test("Delete meme", async(assert)=>{
        let path = '/data/meme';
        
        let response = await fetch(baseUrl+path +`/${lastcreatedMemeId}`, {
            method: "DELETE",
            headers: {
                'X-Authorization' : token 
            }
        });
        assert.ok(response.ok, 'successful response');
    });


