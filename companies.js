const express = require("express");
const db = require("/db");
const pg = require("pg");
const { Router } = require("express");

router.get("/", async function(res, req, next) {
    try{
        const result = await db.query(
            `SELECT code, name
            FROM companies
            ORDER BY name`
        ); 

        return res.json({"companies"});
    }
    
    catch (err) {
        return next(err);
    }

});


router.get("/:code", async function (req, res, next) {
    try {
      let code = req.params.code;
  
      const compResult = await db.query(
            `SELECT code, name, description
             FROM companies
             WHERE code = $1`,
          [code]
      );
  
      const invResult = await db.query(
            `SELECT id
             FROM invoices
             WHERE comp_code = $1`,
          [code]
      );
  
      if (compResult.rows.length === 0) {
        throw new ExpressError(`No such company: ${code}`, 404)
      }
  
      const company = compResult.rows[0];
      const invoices = invResult.rows;
  
      company.invoices = invoices.map(inv => inv.id);
  
      return res.json({"company": company});
    }
  
    catch (err) {
      return next(err);
    }
  });

  


  router.post("/", async function (req, res, next) {
    try {
      let {name, description} = req.body;
      let code = slugify(name, {lower: true});
  
      const result = await db.query(
            `INSERT INTO companies (code, name, description) 
             VALUES ($1, $2, $3) 
             RETURNING code, name, description`,
          [code, name, description]);
  
      return res.status(201).json({"company": result.rows[0]});
    }
  
    catch (err) {
      return next(err);
    }
  });


  router.put("/code", async function (req, res, next) {
      try {
          let {name, description} = req.body; 
          let code = req.params.code; 

          const result = await.db.query(
              `UPDATE companies
              SET name=$1`
              [name, description, code]); 
          )

      }
  });





router.delete("/:code", async function(req, res, next)){
    try{
        let code = req.params.code; 

        const result = await db.query(
            `DELETE FROM companies
            WHERE code=$1
            RETURNING code`
            [code]); 
        )
    }

    catch(err) {
        return next(err); 
    }
}); 

