function getProduct() {
    let inputVal = document.getElementById("barcode").value
    const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`

    fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data)

        if(inputVal.length < 12) {
            alert("please ensure that barcode is 12 characters")
        }

        if(data.status === 1) {
            const item = new ProductInfo(data.product)
            item.showInfo()

            item.listIngredients()
            item.showGluten()

        } else if (data.status === 0) {
            alert(`Product ${inputVal} not found, please try another`)
        }
    })
    .catch(err => {
        console.log("error " + err)
    })
}


class ProductInfo {
    constructor(productData) {
        this.name = productData.product_name
        this.ingredients = productData.ingredients
        this.image = productData.image_url
        this.gluten = productData.allergens
    }

    showInfo() {
        document.getElementById("productImage").src = this.image
        document.getElementById("productName").innerText = this.name
    }

    showGluten() {
        let glutenFreeLabel = document.getElementById("glutenStatus")
        let allergen = this.gluten
        if(allergen.includes("gluten")) {
            glutenFreeLabel.textContent += "No, contains gluten"
        } else {
            glutenFreeLabel.textContent = "Yes, gluten free"
        }
    }

    listIngredients() {
        let tableRef = document.getElementById('ingredientTable')

        for(let i = 1; i < tableRef.rows.length;) {
            tableRef.deleteRow(i)
        }

        for(let key in this.ingredients) {
            let newRow = tableRef.insertRow(-1)
            let newICell = newRow.insertCell(0)
            let newIText = document.createTextNode(
                this.ingredients[key].text
            )
            newICell.appendChild(newIText)
        }
    }
}