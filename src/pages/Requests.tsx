import { BottomNav } from "@/components/BottomNav";

const Requests = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen">
      {/* Main Container */}
      <div className="relative flex min-h-screen w-full max-w-md mx-auto flex-col bg-white dark:bg-slate-900 shadow-2xl overflow-x-hidden pb-20">
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-3 justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
              <img
                alt="SiswaGig Logo Icon"
                className="size-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB97iWO1UR6sHZtMsyBMKkTJjlFRsmKq7nOAKzxYnmLlyCOD5Q3bLW7-NXN4q5NSrGoTucYHf4mhDPl028xjJtRMZmcBfCG3SJ4SzW7c8OmwKh2lM4YFxnO0GVyhoR4bfVSYWQ_RJ5oIf1v4l5ItI_Hp35SaE8YgUUapTGHPzoT9IRkWuQkS3KJ6CCbKZ0rW1aCrmRwrMY6bB5a4mah6beFoUncu5S-nX9rT4PR4nmckttO0IpyLq7Owsv-gU1tW3U9RRfyWEd4HQ"
              />
            </div>
            <h1 className="text-primary text-xl font-bold tracking-tight">SiswaGig</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <button className="size-10 rounded-full overflow-hidden border-2 border-primary/20 p-0.5">
              <img
                alt="Profile"
                className="rounded-full size-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXr5-qF7e8DBgGYtX0PUfrdYNiBEI1mDXvANvKtC5eKr2yQ_aOFF50tWg_6RdGzBmv40K93KLaskLoffq-HLzuh7-QgsowO4Ctp8Yg92aeYrUZ_LtAgT7l1HxM5HC8CqKtv3jAbVsDGkdPpSfZsCNhYp-3E5RudN8CJB624o_m19wv738OAEJn70aYyA6klh-5W8q0fKndiH99cdFXsAVNrBC6MEl_yhj26zLk9f5ZvrfYJh7uGTy5kvm_eubmR10ZMHkYc47Erw"
              />
            </button>
          </div>
        </header>

        {/* Search & Map Preview Section */}
        <div className="px-4 pt-5 pb-2 space-y-4">
          {/* Search Bar */}
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-slate-400">search</span>
            <input
              className="w-full h-12 pl-12 pr-4 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-slate-400"
              placeholder="Search jobs or locations"
              type="text"
            />
            <button className="absolute right-2 p-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-primary">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
          {/* Map Link / Preview Widget */}
          <div className="relative group cursor-pointer overflow-hidden rounded-xl h-24 border border-slate-200 dark:border-slate-800">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBshpbAUMqb8GnNYbeSg_V_HXN3xeYNExooiWvXjToffkYnvwL_ow6j6badUmIz47P-e2SEbmylnvaJ_UeugqnvxwR5EpL8J_A_0iKtLMBEMX2QMt66dvGkUUc425N5BLeh8yQ63hZUkXNM-D-mjmvF3f_XeFKyydWaYALXLdfj3yxOhrgMijCu9xzoQx6x9wr_SwXsV7TtuJ27n7TN3wWGZWyE_A9brYyaD82nGcI-rF-_HRXV7-4FNwXIVnBIvzYLjesbin74qA')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center px-4">
              <div className="text-white">
                <p className="text-xs font-medium uppercase tracking-wider opacity-80">Nearby Gigs</p>
                <p className="text-lg font-bold">12 Jobs near you</p>
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <span className="material-symbols-outlined text-sm">map</span>
                  <span>View on Map</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Tabs */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
          <button className="px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold whitespace-nowrap">
            All Gigs
          </button>
          <button className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold whitespace-nowrap hover:bg-primary/10 transition-colors">
            Design
          </button>
          <button className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold whitespace-nowrap hover:bg-primary/10 transition-colors">
            Tutoring
          </button>
          <button className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold whitespace-nowrap hover:bg-primary/10 transition-colors">
            Manual Labor
          </button>
          <button className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold whitespace-nowrap hover:bg-primary/10 transition-colors">
            Tech Support
          </button>
        </div>

        {/* Request Feed */}
        <main className="flex-1 px-4 space-y-4 pb-4">
          {/* Job Card 1 */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                    Urgent
                  </span>
                  <span className="text-primary text-lg font-bold tracking-tight">$40</span>
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold text-base leading-snug">
                  Furniture Assembly Help
                </h3>
                <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    2.4 km away • South Jakarta
                  </span>
                  <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-medium">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    Due in 5h
                  </span>
                </div>
              </div>
              <div className="size-20 rounded-lg overflow-hidden shrink-0">
                <img
                  alt="Job Image"
                  className="size-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU2ylhw7bdK2BibwB_45zNdPQnCD0QQEFoX8arn0ac_x8oZ2njab64FeJ1ybT7ApeO8Z5KT_x1GOsYlUV8nYGjCXUgQRknyiMg_yYA6K9ktnRXh56X4X08PxISGKPFVt1EUrIzVtxEavQdLHA4DKxGWQ5vJ7I7ZNlIHpIqdpKmNZjKwvzu8ikid4TEZjn1YO1ukoYeoa6ohJiNzKUbboc2Ww2uxWut4njWrB-wtYAdNLmrj6EIxc90GSeghiLzArTnzWSICCJHlA"
                />
              </div>
            </div>
            <button className="mt-4 w-full h-10 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold transition-all">
              Apply Now
            </button>
          </div>

          {/* Job Card 2 */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-primary text-lg font-bold tracking-tight">$25/hr</span>
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold text-base leading-snug">
                  Math Tutor for Middle School
                </h3>
                <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    0.8 km away • Near Campus
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    Starts Tomorrow, 4 PM
                  </span>
                </div>
              </div>
              <div className="size-20 rounded-lg overflow-hidden shrink-0">
                <img
                  alt="Job Image"
                  className="size-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmVLendH4VdNo0tTg36CwFVQIqgtXDIbxOsZosEX3tUWCEhhWFviLXoc-dydwYT0QqC5IQ3quzs2Usj2vZJU5ykjcTt8AkjWQ6tbtUCiVgmQYpfKH7HZ6y4gaVtKj2MZulJNT6ncjQAqgfPI7YHpcQykTJkRvxMQkdYERqLgWZcGhXkET8MH1mwtyE8jkqW69M3rneUMRa9YvLOnB0YMFTKLVK9pZDmXP8SbMxXX9GTVX84dp04aNvRVKQelGnvvZpnGUkMho-Gg"
                />
              </div>
            </div>
            <button className="mt-4 w-full h-10 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold transition-all">
              Apply Now
            </button>
          </div>

          {/* Job Card 3 */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-primary text-lg font-bold tracking-tight">$100</span>
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold text-base leading-snug">
                  Logo Design for Local Coffee Shop
                </h3>
                <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">laptop_mac</span>
                    Remote • Digital Task
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    Deadline: Friday
                  </span>
                </div>
              </div>
              <div className="size-20 rounded-lg overflow-hidden shrink-0">
                <img
                  alt="Job Image"
                  className="size-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4K64t1cBb_qiH0Vhqodzenf0d-9K_y_CvblBeGbAMFihqoHFIaG9V_TKejBJNzpGsneeRhocA0oIlAji9MwJeQtjJfNbjUlEyZM1yGO_8LhBCpG_NGHyahgS3I7blLMBPXc6UBqLBD_nbhkUpj-OvtArW5WezjeLVqUCBXwOvC3fb-xKb1cwaLsU1vwdjERALyBpiXe_V0UjtcpRuT7FjmO5ahhqSpNI66P4BiytEUCXGE7kdQbx063jKk0TCWP1Qzen9e_skAg"
                />
              </div>
            </div>
            <button className="mt-4 w-full h-10 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold transition-all">
              Apply Now
            </button>
          </div>

          {/* Job Card 4 */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-primary text-lg font-bold tracking-tight">$15/hr</span>
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold text-base leading-snug">
                  Dog Walking - Golden Retriever
                </h3>
                <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    1.5 km away • Central Park Area
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    Daily, 7:00 AM
                  </span>
                </div>
              </div>
              <div className="size-20 rounded-lg overflow-hidden shrink-0">
                <img
                  alt="Job Image"
                  className="size-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnYPxu2Pn3NyQ5AqEqMz8umPhGBKXcBn6v7rs84GNHPosaUG_rJT-SDYFcB7bMROEXrNU8BVPQqYUuGFAbQ0t12q3lS3ISX-2FV2rfkjn4lhQ5Yz9jd47WWVhVKMGKPRUr1_uuZ5ABy6l3ymnzphQwUyIXk9u2eSdiC2jkQH87Ffb4iu6MCBj1SKy8EXPW7e6II2ng861OgQDRKCjXtJ5bfVlBSQePiKVTPTRI8BTtNALpCg0cZpgAX8DPuNNHYZyf56TYCknzYw"
                />
              </div>
            </div>
            <button className="mt-4 w-full h-10 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold transition-all">
              Apply Now
            </button>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
};

export default Requests;
