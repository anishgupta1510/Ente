import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";
import Loader from "@/components/Loader";
import Data from "@/interface/Data";

let OriginalredditApi: string = "https://www.reddit.com/r/memes.json?limit=26";

export default function Home() {
  const [dataArray, setDataArray] = useState<Data[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // New loading state

  const observer = useRef<IntersectionObserver | null>(null);

  const fetch = async () => {
    try {
      setLoading(true); // Set loading to true when fetching data
      let redditApi = OriginalredditApi;
      if (after) {
        redditApi += `&after=${after}`;
      }
      const tmp: any = await axios.get(redditApi);
      const childrenArray: [] = tmp.data.data.children;
      const tmpArray: Data[] = childrenArray
        .filter(
          (item: any) => !item.data.is_video && item.data.domain === "i.redd.it"
        )
        .map((item: any) => ({
          postUrl: `reddit.com${item.data.permalink}`,
          thumbnail: item.data.thumbnail,
          thumbnail_height: item.data.thumbnail_height,
          thumbnail_width: item.data.thumbnail_width,
          meme: item.data.url,
        }));

      setDataArray((prev) => [...prev, ...tmpArray]);
      setAfter(tmp.data.data.after);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInfiniteScroll = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && target.intersectionRatio > 0 && !loading) {
      fetch();
    }
  };

  useEffect(() => {
    observer.current = new IntersectionObserver(handleInfiniteScroll, {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    });

    if (observer.current) {
      observer.current.observe(
        document.querySelector(".scroll-trigger") as Element
      );
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [after, loading]);

  const MyGallery = () => {
    return (
      <Gallery>
        {dataArray.map((item: Data, index) => (
          <div className="flex flex-row m-auto" key={index}>
            <Item
              thumbnail={item.meme}
              original={item.meme}
              width="1024"
              height="768"
            >
              {({ ref, open }) => (
                <img
                  ref={ref}
                  onClick={open}
                  src={item.meme}
                  alt={`Thumbnail ${index}`}
                  className="w-64 h-64"
                />
              )}
            </Item>
          </div>
        ))}
      </Gallery>
    );
  };

  return (
    <>
      <div className="flex flex-row justify-center my-4">
        <p className="font-bold text-7xl text-red-600" >
          (REDDIT) MEMES GALLERY
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {
        MyGallery()
        }
      </div>

      {loading && 

        <div className="flex flex-row justify-center" >
          <Loader/>
        </div>
      
      }
      <div className="scroll-trigger" />
    </>
  );
}
