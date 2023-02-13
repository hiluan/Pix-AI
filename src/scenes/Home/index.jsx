import React, { useEffect, useState } from "react";
import { FormField, Card, Loader, Slideshow } from "../../components";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0)
    return data.map((post) => <Card key={post._id} {...post} />);
  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        if (import.meta.env.VITE_API_SHARE) {
          const response = await fetch(import.meta.env.VITE_API_SHARE, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const result = await response.json();
            setAllPosts(result.data.reverse());
          }
        } else {
          throw new Error("VITE_API_SHARE environment variable is not defined");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );

        setSearchedResults(searchResults);
      }, 500)
    );
  };
  return (
    <section>
      <Slideshow firstThree={allPosts && allPosts.slice(0, 4)} />
      <div className="sm:p-8 mt-14 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
        <div className="max-w-7xl mx-auto">
          <div>
            <h1 className="font-extrabold text-[#222328] text-[32px]">
              The Community Showcase
            </h1>
            <p className="mt-2 text-[#666e75] text-[16px] max-w[500px]">
              Browser through a collection of imaginative and visually stunning
              images generated by DALL-E AI{" "}
            </p>
          </div>
          <div className="mt-16">
            <FormField
              labelName="Search Posts"
              type="text"
              name="text"
              placeholder="Search Posts..."
              value={searchText}
              handleChange={handleSearchChange}
            />
          </div>
          <div className="mt-10">
            {loading ? (
              <div className="flex justify-center items-center">
                <Loader />
              </div>
            ) : (
              <>
                {searchText && (
                  <h2 className="font-medium text=[#666e75] text-xl mb-3">
                    Showing results for{" "}
                    <span className="text-[#222328]">{searchText} </span>
                  </h2>
                )}

                <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                  {searchText ? (
                    <RenderCards
                      data={searchedResults}
                      title="No search results found"
                    />
                  ) : (
                    <RenderCards
                      data={allPosts && allPosts.slice(4)}
                      title="No posts found"
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
