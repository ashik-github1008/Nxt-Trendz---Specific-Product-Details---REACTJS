// Write your code here
import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Header from '../Header/index'
import SimilarProductItem from '../SimilarProductItem/index'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productDetailsApiStatus: apiStatusConstants.initial,
    updatedProductDetails: {},
    updatedSimilarProductsList: [],
    productCount: 1,
  }

  onClickMinusBtn = () => {
    const {productCount} = this.state
    if (productCount > 1) {
      this.setState(prevState => ({
        productCount: prevState.productCount - 1,
      }))
    }
  }

  onClickPlusBtn = () => {
    this.setState(prevState => ({
      productCount: prevState.productCount + 1,
    }))
  }

  onClickContinueShoppingBtn = () => {
    const {history} = this.props
    history.replace('/products')
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({
      productDetailsApiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      // console.log(typeof(fetchedData));
      // console.log(fetchedData);
      const updatedProductDetailsData = {
        title: fetchedData.title,
        price: fetchedData.price,
        rating: fetchedData.rating,
        totalReviews: fetchedData.total_reviews,
        description: fetchedData.description,
        availability: fetchedData.availability,
        brand: fetchedData.brand,
        imageUrl: fetchedData.image_url,
      }
      // console.log(updatedData)

      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachProduct => ({
          id: eachProduct.id,
          imageUrl: eachProduct.image_url,
          title: eachProduct.title,
          brand: eachProduct.brand,
          price: eachProduct.price,
          rating: eachProduct.rating,
        }),
      )

      // console.log(updatedSimilarProductsList);

      this.setState({
        productDetailsApiStatus: apiStatusConstants.success,
        updatedProductDetails: updatedProductDetailsData,
        updatedSimilarProductsList: updatedSimilarProductsData,
      })
    } else {
      this.setState({productDetailsApiStatus: apiStatusConstants.failure})
    }
  }

  renderProductsDetailsSuccessView = () => {
    const {updatedProductDetails, updatedSimilarProductsList, productCount} =
      this.state
    return (
      <div className="product-item-details-main-container">
        <div className="product-details-container">
          <img
            src={updatedProductDetails.imageUrl}
            alt="product"
            className="product-details-img"
          />
          <div className="product-details-content-container ml-5">
            <h1 className="product-details-title">
              {updatedProductDetails.title}
            </h1>
            <p className="product-details-price mt-3">
              Rs {updatedProductDetails.price}/-
            </p>
            <div className="rating-review-count-container">
              <div className="rating-number-container mr-3">
                <p className="product-details-rating-number mr-1">
                  {updatedProductDetails.rating}
                </p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png "
                  alt="star"
                  className="star-img"
                />
              </div>
              <p className="reviews-count mt-2">
                {updatedProductDetails.totalReviews} Reviews
              </p>
            </div>
            <p className="product-details-desc mt-2">
              {updatedProductDetails.description}
            </p>
            <div className="available-in-stock-container">
              <p className="available-text mr-2">Available: </p>
              <p className="availability">
                {updatedProductDetails.availability}
              </p>
            </div>
            <div className="product-details-brand-container">
              <p className="available-text mr-2">Brand: </p>
              <p className="product-details-brand-name">
                {updatedProductDetails.brand}
              </p>
            </div>
            <hr className="hr-line mt-0" />
            <div className="number-of-products-container">
              <button
                data-testid="minus"
                className="minus-btn mr-4"
                onClick={this.onClickMinusBtn}
              >
                <BsDashSquare className="minus-or-plus-icon" />
              </button>
              <p className="product-count mt-3">{productCount}</p>
              <button
                data-testid="plus"
                className="plus-btn ml-4"
                onClick={this.onClickPlusBtn}
              >
                <BsPlusSquare className="minus-or-plus-icon" />
              </button>
            </div>
            <div className="mt-2">
              <button className="btn btn-primary add-card-btn">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-products-list-container">
            {updatedSimilarProductsList.map(eachProduct => (
              <SimilarProductItem
                key={eachProduct.id}
                similarProductDetails={eachProduct}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderProductsDetailsFailureView = () => {
    return (
      <div className="failure-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="error-view-img mb-5"
        />
        <h1 className="mb-4">Product Not Found</h1>
        <button
          className="btn btn-primary continue-shopping-btn"
          onClick={this.onClickContinueShoppingBtn}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  renderLoadingView = () => {
    return (
      <div data-testid="loader">
        <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
      </div>
    )
  }

  renderProductDetails = () => {
    const {productDetailsApiStatus} = this.state
    switch (productDetailsApiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderProductsDetailsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    // console.log('render')
    return (
      <>
        <Header />
        <div className="product-item-details-app-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
