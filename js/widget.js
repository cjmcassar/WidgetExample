// Template for the item

const Item = ({ id, name, price, currency_symbol, image, merchant_text, link, percentage }) => `
    <div class="card mt-2 p-2">
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex flex-row align-items-center time">
                <div id="rating-${id}"></div>
                <small class="text-muted mt-2">(${percentage}%)</small>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-2 col-sm-12 mr-3"> <img src="${image}" width="100px"> </div>
            <div class="col-lg-9 col-sm-12 d-flex flex-column">
                <h5>${name}</h5>
                <div class="row mt-auto">
                    <div class="col-lg-4 col-sm-12">
                        <span class="text-success align-middle">${price}${currency_symbol}</span>
                    </div>
                    <div class="text-center col-lg-8 col-sm-12">
                        <a href="${link}" target="_blank" class="btn-block btn-primary btn-sm active" role="button">${merchant_text}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;


//Holds image of the item
function setImage(product) {
    if (!product.image) {
        if (!product.model_image) {
            return "https://via.placeholder.com/100";
        } else {
            return product.model_image;
        }
    } else {
        return product.image;
    }
}


// go through product data to pick only needed information

function parseData(data) {
    var products = [];
    $.each(data.widget.data.offers, function(index, product) {
        var image = setImage(product);
        var product_data = {
            name: product.offer.name,
            price: product.offer.price,
            currency_symbol: product.offer.currency_symbol,
            image: image,
            merchant_text: product.offer.merchant_link_text,
            link: product.offer.link,
            percentage: product.percentage,
            id: product.id
        };
        // Replace missing values with a placeholder
        Object.keys(product_data).forEach(function(key) {
            if(product_data[key] === null) product_data[key] = '---';
        });
        products.push(product_data);
    });
    return products;
}


// put product information into table 
function setData() {
    const url = "https://search-api.fie.future.net.uk/widget.php?id=review&model_name=xbox_one_s&area=GB";
    $.ajax({
        url: url,
        success: function(raw_data) {
            var data = parseData(raw_data);
            $('.product-table').append(data.map(Item).join(''));
            $.each(data, function(index, product) {
                $("#rating-" + product.id).starRating({
                    starSize: 15,
                    initialRating: 0.05 * product.percentage,
                    readOnly: true,
                });
            });
        }
    });
}