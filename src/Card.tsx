import { singular } from "pluralize";

type CardProps = {
  postTopic: string;
  mediaURL: string;
  postTitle: string;
  postAuthor: string;
  postDate: string;
  postType: string;
  postURL: string;
  authorURL: string;
};

function Card(props: CardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
  }).format(new Date(props.postDate));

  return (
    <div className="p-card u-no-padding">
      <div className="card__header">
        <h5 className="p-muted-heading">{props.postTopic}</h5>
      </div>
      <div className="card__content">
        <a href={props.postURL}>
          <img
            className="p-card__image p-5"
            src={props.mediaURL}
            alt=""
            height="185"
            width="330"
          />
        </a>
        <h3 className="p-heading--4">
          <a href={props.postURL}>{props.postTitle}</a>
        </h3>
        <em>
          by <a href={props.authorURL}>{props.postAuthor}</a> on {formattedDate}
        </em>
      </div>
      <div className="card__footer">{singular(props.postType)}</div>
    </div>
  );
}

export default Card;
