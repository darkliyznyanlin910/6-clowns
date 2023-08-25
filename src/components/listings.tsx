import Link from "next/link";
import { useRouter } from "next/router";

const Listings = () => {
  return (
    <div className="">
      {/* card */}
      <h1 className="lg:mx-100 mx-20 text-2xl font-bold md:mx-40">
        Lobangs Around you!
      </h1>
      &nbsp;
      <div className="card lg:mx-100 mx-20 flex flex-col  overflow-hidden rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 md:mx-40 lg:flex-row ">
        <img
          className="w-2.5/5"
          src="https://cdn-ajggd.nitrocdn.com/kMoOFpDlsOVtlYJLrnSRNCQXaUFHZPTY/assets/images/optimized/rev-814242f/wp-content/uploads/bb-plugin/cache/night-landscape-photography-featured-landscape-7adbbe52e2e7586f094047236f31999a-zybravgx2q47.jpg"
          height="350"
          width="400"
          alt="thumbnail"
        />
        <div className="carddetails w-2/5 flex-col justify-start p-8">
          <h5 className="mb-2  text-xl font-medium text-neutral-800">
            Card title
          </h5>

          <p className="text-xs text-neutral-500 ">Expires in --- minutes</p>

          {/* Reviews */}
          <div className="">
            <h3 className="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50">
              Reviews
            </h3>
            {/* Review List */}
            <ul className="w-58 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
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
        <p className="flex-end w-0.5/5 p-8  text-xs text-neutral-500">
          2.1 KM Away
        </p>
      </div>
      &nbsp;
      {/* card */}
      <Link href={"/post/create"}>
        <div className="card lg:mx-100 mx-20 flex flex-col  overflow-hidden rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 md:mx-40 lg:flex-row ">
          <img
            className="w-2.5/5"
            src="https://cdn-ajggd.nitrocdn.com/kMoOFpDlsOVtlYJLrnSRNCQXaUFHZPTY/assets/images/optimized/rev-814242f/wp-content/uploads/bb-plugin/cache/night-landscape-photography-featured-landscape-7adbbe52e2e7586f094047236f31999a-zybravgx2q47.jpg"
            height="350"
            width="400"
            alt="thumbnail"
          />
          <div className="carddetails w-2/5 flex-col justify-start p-8">
            <h5 className="mb-2  text-xl font-medium text-neutral-800">
              Card title
            </h5>

            <p className="text-xs text-neutral-500 ">Expires in --- minutes</p>
          </div>
          <p className="flex-end w-0.5/5 p-8 text-xs text-neutral-500">
            2.1 KM Away
          </p>
        </div>
      </Link>
    </div>
  );
};

export default Listings;
