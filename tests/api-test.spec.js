const { test, expect } = require('@playwright/test');
const { Ajv } = require("ajv");
const { request } = require("http");
const ajv = new Ajv();

test('TC-1 GET', async ({request}) => {
    //API Key
    const apiKey = 'reqres-free-v1';

    // API Call
    const response =  await request.get('https://reqres.in/api/users/1',{
        headers: {
            'x-api-key': apiKey
        }
    });

    expect (response.status()).toBe(200);
    const responseData = await response.json();
    const url = "https://reqres.in/img/faces/1-image.jpg"

    expect (responseData.data.id).toBe(1);
    expect (responseData.data.email).toBe("george.bluth@reqres.in");
    expect (responseData.data.first_name).toBe("George");
    expect (responseData.data.last_name).toBe("Bluth");
    expect (responseData.data.avatar).toBe(url)

    const valid = ajv.validate(require('./JSON-Schema/GET.json'), responseData);

    if(!valid){
        console.log("Ajv Validate Error:",  ajv.errorsText());
    };

    expect(valid).toBe(true);
});

test('TC-2 POST', async({request}) => {
    // API Key
    const apiKey = 'reqres-free-v1';

    // Body
    const body = {
        name: "Antony",
        job: "GOAT OF Real Betis"
    };
    
    // API Call
    const response = await request.post('https://reqres.in/api/users',{
        data: body,
        headers: {
            'x-api-key': apiKey
        }

    });
   
    const responseData = await response.json();
    expect(response.status()).toBe(201);
    expect(responseData).toHaveProperty('name', body.name);
    expect(responseData).toHaveProperty('job', body.job);
    expect(responseData).toHaveProperty('id');
    expect(responseData).toHaveProperty('createdAt');

    expect(typeof responseData.id).toBe('string');
    expect(responseData.id).not.toBe('');
    
    expect(typeof responseData.createdAt).toBe('string');
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    expect(iso8601Regex.test(responseData.createdAt)).toBeTruthy();

    const valid = ajv.validate(require('./JSON-Schema/POST.json'), responseData);

    if(!valid){
        console.log("Ajv Validation Error:", ajv.errorsText);
    }

    expect(response.ok).toBeTruthy();
});

test('TC-3 DELETE', async({request}) =>{
    // API Key
    const apiKey = 'reqres-free-v1';
    
    // API Call
    const response = await request.delete('https://reqres.in/api/users/1',{
        headers: {
            'x-api-key': apiKey
        }
    });

    expect([204]).toContain(response.status());
    let responseData = {};
    if(response.status() !== 204){
        responseData = await response.json();
    }

    expect(responseData).toEqual({});
});

test('TC-4 PUT', async({request}) => {
    // API Key
    const apiKey = 'reqres-free-v1';

    // Body
    const body = {
        name: "Antony",
        job: "Brazilian Football Player"
    };
    
    // API Call
    const response = await request.put('https://reqres.in/api/users/1',{
        data: body,
        headers: {
            'x-api-key': apiKey
        }
    });

    const responseData = await response.json();
    expect(response.status()).toBe(200);

    expect(responseData).toHaveProperty('name', body.name);
    expect(responseData).toHaveProperty('job', body.job);
    expect(responseData).toHaveProperty('updatedAt');

    expect(typeof responseData.updatedAt).toBe('string');
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    expect(iso8601Regex.test(responseData.updatedAt)).toBeTruthy();

    const valid = ajv.validate(require('./JSON-Schema/PUT.json'), responseData);

    if(!valid){
        console.log("Ajv Validation Error:", ajv.errorsText);
    }

    expect(response.ok).toBeTruthy();

});