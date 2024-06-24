const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3000'; // Application host (NOT service host - that can be anything)

let browser;
let context;
let page;

let user = {
    username : "",
    email : "",
    password : "123456",
    confirmPass : "123456",
};

let meme={
    title: "",
    description: "",
    imageUrl: '/images/welcome-meme.jpg'
}

describe("e2e tests", () => {
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    
    describe("authentication", () => {
        test ("Registration with valid Data", async ()=>{
            await page.goto(host);
            await page.locator('a[href="/register"]').first().click();

            await page.waitForSelector('form');
            let random = Math.floor(Math.random()*1000);
            user.username=`Auto_Test_username_${random}`;
            user.email=`abv_${random}@abv.bg`;
            await page.locator('#username').fill(user.username);
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.locator('#repeatPass').fill(user.confirmPass);

           let [response] =  await Promise.all([
                page.waitForResponse(response=> response.url().includes('/users/register') && response.status()===200),
                page.click('input[type="submit"]')
            ]);
            expect (response.ok()).toBeTruthy();
            let userData= await response.json();
            console.log(userData);
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);

        });

        test ("Login with valid Data", async ()=>{
            await page.goto(host);
            await page.locator('a[href="/login"]').first().click();
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            
            let[response] = await Promise.all([
                page.waitForResponse(response=> response.url().includes('/users/login')&& response.status()===200),
                page.click('input[type="submit"]')
            ])
            expect(response.ok()).toBeTruthy();
            let userData=await response.json();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        });

        test ("Logout from the App", async ()=>{
            await page.goto(host);
            await page.locator('a[href="/login"]').first().click();
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            page.click('input[type="submit"]')

            let [response] = await Promise.all([
                page.waitForResponse(response=> response.url().includes('/users/logout')&& response.status()===204),
                page.locator('a[href="/logout"]').click()
            ])
            expect (response.ok()).toBeTruthy();

            await page.locator('a[href="/login"]');

            await page.waitForURL(host+'/');
            expect(page.url()).toBe(host +'/');
        });
        
    });

    describe("navbar", () => {
        test ("Navigation bar for logged in users", async ()=>{
            await page.goto(host);
            await page.locator('a[href="/login"]').first().click();
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('input[type="submit"]')

            await expect(page.locator('a[href="/login"]').first()).toBeHidden();
            await expect(page.locator('a[href="/register"]').first()).toBeHidden();

            await expect(page.locator('a[href="/catalog"]')).toBeVisible();
            await expect(page.locator('a[href="/create"]')).toBeVisible();
            await expect(page.locator('a[href="/myprofile"]')).toBeVisible();
            await expect(page.locator('a[href="/logout"]')).toBeVisible();
            await expect(page.locator('div.profile>span')).toBeVisible();

        });

        test ("Navigation bar for guests", async ()=>{
            await page.goto(host);
            await expect(page.locator('a[href="/login"]').first()).toBeVisible();
            await expect(page.locator('a[href="/register"]').first()).toBeVisible();
            await expect(page.locator('a[href="/catalog"]')).toBeVisible();
            await expect(page.locator('a[href="/"]')).toBeVisible();// home page
            await expect(page.locator('a[href="/create"]')).toBeHidden();
            await expect(page.locator('a[href="/myprofile"]')).toBeHidden();
            await expect(page.locator('a[href="/logout"]')).toBeHidden();
        });
    });

    describe("CRUD", () => {
        beforeEach(async ()=>{
            await page.goto(host);
            await page.locator('a[href="/login"]').first().click();
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('input[type="submit"]')
        })
        test ("Create a meme", async ()=>{
            
            await page.locator('a[href="/create"]').click();
            await page.waitForSelector('form');

            let random = Math.floor(Math.random()*1000);
            meme.title= `Auto_Test_title_${random}`;
            meme.description= `Auto_Test_description_${random}`;
            
            await page.locator('#title').fill(meme.title);
            await page.locator('#description').fill(meme.description);
            await page.locator('#imageUrl').fill(meme.imageUrl);
            let [response] = await Promise.all([
                page.waitForResponse(response=>response.url().includes('/data/memes') && response.status()===200),
                page.locator('input[type="submit"]').click()
            ])
            expect(response.ok()).toBeTruthy();
            let memeData= await response.json();
            expect(memeData.title).toBe(meme.title);
            expect(memeData.description).toBe(meme.description);
            expect(memeData.imageUrl).toBe(meme.imageUrl); 
        });

        test ("Edit a meme", async ()=>{
            await page.locator('a[href="/myprofile"]').click();
            await page.locator('//a[text()="Details"]').first().click();
            await page.locator('//a[text()="Edit"]').click();
            await page.waitForSelector('form');

            let random = Math.floor(Math.random()*1000);
            meme.title= `Auto_Test_Edited_title_${random}`;
            await page.locator('#title').fill(meme.title);
            
            let [response] = await Promise.all([
                page.waitForResponse(response=>response.url().includes('/data/memes') && response.status()===200),
                page.locator('input[type="submit"]').click()
            ])
            expect(response.ok()).toBeTruthy();
            let memeData= await response.json();
            expect(memeData.title).toBe(meme.title);
            expect(memeData.description).toBe(meme.description);
            expect(memeData.imageUrl).toBe(meme.imageUrl); 

        });

        test ("Delete a meme", async ()=>{
            await page.locator('a[href="/myprofile"]').click();
            await page.locator('//a[text()="Details"]').first().click();

            let [response] = await Promise.all([
                page.waitForResponse(response=>response.url().includes('/data/memes') && response.status()===200),
                page.locator('//button[text()="Delete"]').click()
            ])
            expect(response.ok()).toBeTruthy();

        });
    });
});