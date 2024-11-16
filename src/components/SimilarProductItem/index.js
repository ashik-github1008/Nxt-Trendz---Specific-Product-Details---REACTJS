// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProductDetails} = props

  return (
    <li className="similar-product-item-container mt-3">
      <img
        src={similarProductDetails.imageUrl}
        alt={`similar product ${similarProductDetails.title}`}
        className="similar-product-image"
      />
      <p className="similar-product-name mt-3 mb-2">
        {similarProductDetails.title}
      </p>
      <p className="similar-product-brand">by {similarProductDetails.brand}</p>
      <div className="similar-product-price-rating-container">
        <p className="similar-product-price">
          Rs {similarProductDetails.price}/-
        </p>
        <div className="d-flex flex-row similar-product-rating-container">
          <p className="similar-product-rating mt-3 mr-1">
            {similarProductDetails.rating}
          </p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-item-star-img"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
