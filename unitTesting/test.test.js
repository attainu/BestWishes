const get = require("../controller/get_route/get")

// testing on resetClient get route
test("testing on resetClient get route",()=>{
    const req = {}
    const last = "post your password"
    const res = {
        status:(a)=>{return a},
        json:(data)=>data
    }
    req.params ={token:"something"}
    const result = get.resetClient(req,res)
    expect(result.message).toBe(last)
})

// testing on reset get route
test("testing on reset route",()=>{
    const req = {}
    const last = "post your password"
    const res = {status:(a)=>{return a},
                json:(data)=>data}
    req.params ={token:"something"}
    const result = get.reset(req,res)
    expect(result.message).toBe(last)
})

test("testing on admin bookirg route",async()=>{
    const req = {}
    const res = {
        status:(a)=>a,
        json:(a)=>a,
        payload:{id:1}
    }
    const result = await get.admin_booking(req,res)
    expect(result).toBe(200)
    
})