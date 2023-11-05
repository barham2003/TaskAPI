
class ApiFeatures {
    constructor(query,queryString){
        this.query = query
        this.queryString = queryString
    }


    sort() {
        return this
    }
    
    
    
    filter(){
    let queryObj = {...this.queryString}

      // Determining Excluded Fields!
      const excludedFields = ["sort" , "page" , "limit" , "fields", "select"]

      // Deleting Excluded Fields from queryObj
      excludedFields.forEach(el => delete queryObj[el])

      // 1B) ---- Advanced Filtering ----

      // Changing the queryObj to String
      queryObj = JSON.stringify(queryObj)

      // then replaces the gte to $gte
      queryObj = queryObj.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

      // Changing back to json
      queryObj = JSON.parse(queryObj)

      //passing the queryObj to the this.query
      this.query = this.query.find(queryObj)
      return this   
    }


    sort(){
        if(this.queryString.sort) {
          const sortBy = this.queryString.sort.split(",").join(" ")
          this.query = this.query.sort(sortBy)
        } else {
          this.query = this.query.sort("-createdAt")
        }
        return this
      }
  
      select() {
        if(this.queryString.select) {
          const fields = this.queryString.select.replaceAll(","," ")
          this.query = this.query.select(fields)
        } else {
          this.query = this.query.select("-__v")
        }
  
        return this
      }
    
    
    
 }

 module.exports = ApiFeatures