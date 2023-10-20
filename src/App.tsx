import { useQuery } from "react-query";
import Card from "./Card";

type PostStructure = {
  date: string;
  link: string;
  featured_media: string;
  title: {
    rendered: string;
  };
  _embedded: {
    author: [
      {
        name: string;
        link: string;
      }
    ];
    "wp:term": [
      {
        taxonomy: string;
        name: string;
      }
    ][];
  };
};

function App() {
  const result = useQuery<PostStructure[]>("posts", getBlogPosts, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (result.isLoading) {
    return <div className="u-align--center">Loading...</div>;
  }

  if (result.isSuccess) {
    const posts = result.data;

    if (!posts) {
      return <div>Something went wrong</div>;
    }

    return (
      <div className="row cards">
        {posts.map((post: PostStructure, idx: number) => {
          return (
            <div className="col-4" key={idx}>
              {<Card {...getRequiredPostData(post)} />}
            </div>
          );
        })}
      </div>
    );
  }
}

function getRequiredPostData(post: PostStructure) {
  const arrayOfArray = post._embedded["wp:term"];

  const map = new Map();

  for (let i = 0; i < arrayOfArray.length; i++) {
    const arrayOfObjects = arrayOfArray[i];
    for (let j = 0; j < arrayOfObjects.length; j++) {
      const object = arrayOfObjects[j];
      const key = object.taxonomy;
      const value = object.name;

      if (!map.has(key)) {
        map.set(key, value);
      }
    }
  }

  const postTopic = map.get("topic") || map.get("post_tag");
  const mediaURL = post.featured_media;
  const postTitle = post.title.rendered;
  const postAuthor = post._embedded.author[0].name;
  const postDate = post.date;
  const postURL = post.link;
  const postType = post._embedded["wp:term"][0][0].name;
  const authorURL = post._embedded.author[0].link;

  return {
    postTopic,
    mediaURL,
    postTitle,
    postAuthor,
    postDate,
    postURL,
    postType,
    authorURL,
  };
}

async function getBlogPosts() {
  const blogPostURL =
    "https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json";
  const response = await fetch(blogPostURL);
  const posts = await response.json();
  return posts;
}

export default App;
