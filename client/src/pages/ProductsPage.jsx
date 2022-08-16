import React, { useEffect, useState } from "react";
import MetaData from "../components/layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../features/product/productSlice";
import ProductCard from "../components/product/ProductCard";
import { Pagination, Slider } from "@mui/material";
import { useParams } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";

const categories = ["electronics", "books", "fashion"];

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, resultPerPage, totalProductsCount, filteredProductsCount } =
    useSelector((state) => state.product);

  const { search } = useParams();

  const [price, setPrice] = useState([0, 2500]);
  const [ratings, setRatings] = useState(0);
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [toggleFilter, setToggleFilter] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProducts(search, currentPage, price, category, ratings));
  }, [dispatch, search, currentPage, price, category, ratings]);

  return (
    <div className="min-h-screen w-full">
      <MetaData title="Explore Products" />
      <div className="container mx-auto flex relative">
        <div
          className={`${
            toggleFilter ? "block absolute" : "hidden"
          } lg:block w-[16rem] p-5 m-5 z-10 bg-white border-2 border-slate-300`}
        >
          <h2>Filters</h2>
          <div>
            <h3>Price</h3>
            <Slider
              size="small"
              sx={{ width: "11rem" }}
              getAriaLabel={() => "Price Filter Slider"}
              value={price}
              onChange={(event, newValue) => setPrice(newValue)}
              valueLabelDisplay="auto"
              disableSwap
              step={500}
              marks
              min={0}
              max={5000}
            />

            <h2>Categories</h2>
            <ul>
              {categories.map((category) => (
                <li
                  key={category}
                  className="cursor-pointer"
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
              <button onClick={() => setCategory("")}>See All</button>
            </ul>

            <h3>Ratings</h3>
            <Slider
              size="small"
              sx={{ width: "11rem" }}
              aria-labelledby="continuous-slider"
              value={ratings}
              onChange={(e, newRating) => setRatings(newRating)}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={5}
            />
          </div>
          <div
            className="min-h-full"
            onClick={() => toggleFilter && setToggleFilter(false)}
          />
        </div>

        {category && (
          <div className="w-full h-10 flex items-center justify-center cursor-pointer absolute">
            <h2 className="flex items-center space-x-2 py-1 px-2 mt-2 text-2xl text-slate-600">
              {category.slice(0, 1).toUpperCase() + category.slice(1)}
            </h2>
          </div>
        )}
        <div className="w-full h-10 flex lg:hidden items-center justify-end cursor-pointer absolute">
          <h2
            onClick={() => setToggleFilter((prev) => !prev)}
            className="flex items-center space-x-2 py-1 px-2 mt-3 border-2 rounded-sm bg-blue-100 border-blue-400 active:bg-blue-300"
          >
            <span className="text-lg text-slate-600">Filters</span>
            <FilterListIcon />
          </h2>
        </div>

        <div className="grid grid-cols-2 px-2 lg:px-8 my-14 sm:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 md:gap-12 xl:gap-20">
          {products &&
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>
      </div>
      <div className="w-full flex justify-center items-center my-7">
        {filteredProductsCount > resultPerPage && (
          <Pagination
            variant="outlined"
            shape="rounded"
            size="large"
            defaultPage={1}
            count={Math.ceil(filteredProductsCount / resultPerPage)}
            showFirstButton
            showLastButton
            onChange={(e, pageValue) => setCurrentPage(pageValue)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
