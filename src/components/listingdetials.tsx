import Link from "next/link";
import { useRouter } from "next/router";
const ListingDetails = () => {
  return (
    <div>
      <div className="">
        {/* card */}
        <div className="card lg:mx-100 mx-20 flex flex-col overflow-hidden rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 md:mx-40 lg:flex-row ">
          <img
            className=""
            src="https://cdn-ajggd.nitrocdn.com/kMoOFpDlsOVtlYJLrnSRNCQXaUFHZPTY/assets/images/optimized/rev-814242f/wp-content/uploads/bb-plugin/cache/night-landscape-photography-featured-landscape-7adbbe52e2e7586f094047236f31999a-zybravgx2q47.jpg"
            height="350"
            width="400"
            alt="food thumbnail"
          />
          <div className="flex flex-col justify-start p-6">
            {/* Food Description and Location */}
            <h5 className="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50">
              Food Description
            </h5>
            <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
              Address
            </p>
            {/* Status, Stars and Price Buttons */}
            <div className="">
              <button
                type="button"
                className="mb-2 mr-2 rounded-full bg-[#FF5631] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                Status
              </button>
              <button
                type="button"
                className="mb-2 mr-2 rounded-full bg-yellow-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-900"
              >
                4.5 Stars
              </button>
              <button
                type="button"
                className="mb-2 mr-2 rounded-full bg-lime-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-900"
              >
                Price
              </button>
            </div>
            {/* Remarks and Expire Time */}
            <p className="text-xs text-neutral-500 dark:text-neutral-300">
              Remarks
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-300">
              Come and clear!
            </p>
            &nbsp;
            <p className="text-xs text-neutral-500 dark:text-neutral-300">
              Expires in 30 mins!
            </p>
            {/* Reviews */}
            <div className="">
              <h3 className="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50">
                Reviews
              </h3>
              {/* Review List */}
              <ul className="w-48 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <li className="w-full rounded-t-lg border-b border-gray-200 px-4 py-2 dark:border-gray-600">
                  Review 1
                </li>
                <li className="w-full border-b border-gray-200 px-4 py-2 dark:border-gray-600">
                  Review 2
                </li>
                <li className="w-full border-b border-gray-200 px-4 py-2 dark:border-gray-600">
                  Review 3
                </li>
                <li className="w-full rounded-b-lg px-4 py-2">Review 4</li>
              </ul>
            </div>
            {/* Back and Jiak Buttons */}
            <div className="">
              <button
                type="button"
                className="mb-2 mr-2 rounded-full bg-gray-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                Back
              </button>
              <button
                type="button"
                className="mb-2 mr-2 rounded-full bg-[#FF5631] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-900"
              >
                JIAK!
              </button>
            </div>
          </div>
        </div>
        &nbsp;
      </div>
    </div>
  );
};

export default ListingDetails;
