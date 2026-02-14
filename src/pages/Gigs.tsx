import { BottomNav } from "@/components/BottomNav";

const Gigs = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased min-h-screen">
      {/* Main Container */}
      <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-slate-900 shadow-xl overflow-hidden pb-20">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <span className="material-symbols-outlined text-white text-xl">work</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-primary">SiswaGig</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </button>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/20 cursor-pointer">
              <img
                alt="User Profile"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6eE8TBWBWCTT5GiVGh7SHOU87ve-GDTveRAy3yxkdZGlimnb5dwxuzEhoHXIvVD0Adm4obGrf52pUiGXshzPn0ZnemOsbMUEfAneYHTVGlfz8AzieCo-zpd6rdfalxIm_qGOQJP2giItSJxeTV14Xn4u-dp9mYlR-TsG1IAWDlfO_s38Zs8I55AEc3-zfQhxoHBQbTEv9Ho47Siu1sxQzIXrWfF1kLPiXXGuVQgXe63fhpYBlR5dxDgeLlvKhQDPN8vt7oh_fwA"
              />
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="px-4 pt-4">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-slate-400">search</span>
            <input
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-500"
              placeholder="Search for services or skills"
              type="text"
            />
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex gap-2 overflow-x-auto px-4 py-4 hide-scrollbar">
          <button className="flex shrink-0 items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white">
            All
          </button>
          <button className="flex shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">
            Design
          </button>
          <button className="flex shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">
            Tutoring
          </button>
          <button className="flex shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">
            Tech
          </button>
          <button className="flex shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">
            Delivery
          </button>
        </div>

        {/* Gigs Wall Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Featured Services</h2>
            <button className="text-xs font-semibold text-primary uppercase tracking-wider">See All</button>
          </div>

          {/* Gig Feed */}
          <div className="grid grid-cols-1 gap-6">
            {/* Card 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 transition-transform active:scale-[0.98]">
              <div className="relative aspect-video">
                <img
                  alt="Logo Design Service"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCowXd2VRb8flAqi4ppVXcswy_B1V-mNlj3USfLnFuIsSlRp4Qr8j-wBSp0XXPTeL_vYM18h5iRD9tDkmxBTAb247ggttOVPBx9byAzgp1a29wfJ8rPbUYJh3b8LN3tf9Qv4agLFO_bjKHVfJB3n3K1NJIU8q7QGlg40SxoLTbpY2VP-7HpAQN3VHh6VucrTDC91cNxrFsPIYkURDnEMQplB_VQB5qh1klu8EWQccv7qxIFBVg-WgH1TQ3USGvW-NyQ-p8mxeDXMw"
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-1.5 rounded-full shadow-sm">
                  <span className="material-symbols-outlined text-rose-500 text-lg leading-none">favorite</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      alt="Sarah"
                      className="h-6 w-6 rounded-full object-cover border border-primary/20"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA03zJXtpgQHQ4Fch1Ivmaqh8y3RE8Z9_aYkq7FPjsPujDt0LcRF6YwkXjjszNLMrwxAB6Z9SZAOtHxJWELL2SGU9D6tkPogC6oUqE6PbdJN5vusShBO2t0cEIo7fV6oZJXls7CKvl6TtJ9PK18QhwAlND-eJjLKjkRHHuAa8gUb9QcRDAgHGWBSMXDRH8DdhdZQGPNL1gffj6gM_meisLE3grZXYcSgpWRdz5AOJbvWnKYzEEZHr8bX6NXYtKO0b_QNte7IH6C9A"
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sarah</span>
                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[10px] text-primary font-bold">verified</span>
                      <span className="text-[10px] font-bold text-primary uppercase">Expert</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">4.9</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white leading-tight mb-3">
                  Modern Logo Design &amp; Brand Identity for Startups
                </h3>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700/50">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none">Starting at</span>
                  <span className="text-lg font-bold text-primary leading-none">$20</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 transition-transform active:scale-[0.98]">
              <div className="relative aspect-video">
                <img
                  alt="Math Tutoring Service"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYJVMdPL4t7-YJilJP4yuViCbUqoX29AnBwiTVKNso6EEJD82cLcA8hcSmnNxW6EUWtjyPQqK5_LaxWh7PLesk1g1bglspSPM18-9xEVWmDa8MrhALJPGuqhlTx9OMztb4iEO0t7aLv18lHEFr9OJrypzKqxhQT0NXM8I6mz14QDT9LVYyc0dg1VtLUGyC6LKBnlwNf4_xZiy_YTapKZQaUP14juby4C4HjU0USN_dRbjPD05i7G0Y_BOjYFze-ekLf0z1vWzWSA"
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-1.5 rounded-full shadow-sm text-slate-400">
                  <span className="material-symbols-outlined text-lg leading-none">favorite</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      alt="James"
                      className="h-6 w-6 rounded-full object-cover border border-primary/20"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8aL90t2dRKBLLhwojz_gFH7L9o-8fr72Jtw09DrGqTSXKQFmejyvr_EmwpLlfhi1ZniVSIJkk5_IJ60p8LN3zcEjuUeACgh8aT6pblGnv0OVjTczNm5w8sGNJi522_reTmz5BbVz5a6LHWfiXFqOLk8YgjB3Bs2HMEC44U_aNY_vNOslHPl07SPohHBosEL-xahjh3AQuB8XIUhZLhPSjIHtjTifFT1roDn3KjnrBsw0gRwk6cPAOcIDsg9VRPFmFKu4GJp7nbA"
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">James</span>
                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[10px] text-primary font-bold">military_tech</span>
                      <span className="text-[10px] font-bold text-primary uppercase">Pro</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">4.8</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white leading-tight mb-3">
                  One-on-One Math Tutoring (Grade 10 &amp; 11)
                </h3>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700/50">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none">Starting at</span>
                  <span className="text-lg font-bold text-primary leading-none">$15</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 transition-transform active:scale-[0.98]">
              <div className="relative aspect-video">
                <img
                  alt="Python Programming"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmvUQwVK562hqOgghRwEQLjq4SOh-XUPxOvb3EakP7kqR1dICC78ijYuN4H9lbME0DhPJ5C-X_rmwMrcH99fGacMdkM9MwIxbJlLCrK_afzfRovCfGJyCHYHT4rHyds7eC_RiFf6oxk8JHHGixotA7oOoIqyROmWaRfZ5QTPFGYm-HX7MK58Wz6uAHLO9TX1Y-fsCwUgCdfxokta5akQHWuewQhv3hKku3O9uvNJupso3P07S0Z33b_HqPhogIfnvA2FhpfhIzTw"
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-1.5 rounded-full shadow-sm text-slate-400">
                  <span className="material-symbols-outlined text-lg leading-none">favorite</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      alt="Alex"
                      className="h-6 w-6 rounded-full object-cover border border-primary/20"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbAGult-Rr2zjJhN700obunVucw7x4-azWNIUU3oL8low4dQfrwAamkKfxI69Ox2zxjVGuS7m5-IFuWNBt9E1kxs55QukWspna7-ebtd_imf-Vh-FzCv0UyZXYVq9rKUUGwJDeumGByrMAKgRCuVloiTfNY-tGhzlfe55OOMglh56deLqwm-XtGbkg8kPN_0CFGVXfOxBCLkBEA7dpB0KFMwhL0S3tKa2ABQW8WS0GaVQMUmdCCFWKUh9VRn6Y-v5s0raJKjXdHw"
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Alex</span>
                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[10px] text-primary font-bold">verified</span>
                      <span className="text-[10px] font-bold text-primary uppercase">Expert</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">5.0</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white leading-tight mb-3">
                  Custom Python Scripting &amp; Data Automation
                </h3>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700/50">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none">Starting at</span>
                  <span className="text-lg font-bold text-primary leading-none">$50</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
};

export default Gigs;
