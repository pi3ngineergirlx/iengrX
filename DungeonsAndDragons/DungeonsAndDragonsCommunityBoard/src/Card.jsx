const Card = (props) => {
    return (
        <td className={'card' + props.color}>
            <h3>{props.title}</h3>
            <img src={props.image} alt={props.imagedescription} />
            <h5>{props.description}</h5>
            <button>{props.button}</button>
        </td>
    )
}

export default Card;