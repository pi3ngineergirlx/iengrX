import { Link } from 'react-router-dom'

const Card = (props) => {
    return (
        <div className={'card '}>
            <h4>{props.title}</h4>
            <img src={props.image} alt={props.imagedescription} />
            <h5>{props.description}</h5>
            {/* Link the card button to the provided `to` prop (defaults to /posts) */}
            <Link to={props.to || '/posts'}>
              <button>{props.button}</button>
            </Link>
        </div>
    )
}

export default Card;