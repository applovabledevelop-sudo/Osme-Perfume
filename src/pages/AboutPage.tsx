import React from 'react';
import { Sparkles, Award, ShieldCheck, Heart, Leaf } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface AboutPageProps {
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const { settings } = useSettings();

  return (
    <div className="w-full bg-[#FAF7F2] py-12 sm:py-20 border-b border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[11px] font-bold tracking-[0.3em] text-[#C5A059] uppercase">
            Maison Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#141312]">
            The Alchemy of Rare Notes
          </h1>
          <p className="text-sm sm:text-base text-[#7A756D] leading-relaxed">
            {settings.aboutStory ||
              'Founded with an uncompromising passion for haute parfumerie, Luxora Perfumes bridges classical French olfactory architecture with contemporary avant-garde aesthetics.'}
          </p>
        </div>

        {/* Feature Split 1: Philosophy & Craftsmanship */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-white border border-[#E8E2D7] shadow-lg">
            <img
              src="/images/hero_perfume.jpg"
              alt="Maison Luxora Flacon"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-[#C5A059] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Our Philosophy</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#141312]">
              Invisible Haute Couture
            </h2>
            <p className="text-xs sm:text-sm text-[#7A756D] leading-relaxed">
              {settings.aboutPhilosophy ||
                'We believe perfume is an invisible garment—the most intimate expression of personal identity. We refuse synthetic shortcuts, selecting sustainably harvested harvests from Grasse, Taif, and Southeast Asia.'}
            </p>

            <h3 className="font-serif text-2xl text-[#141312] pt-4">
              Six Months Maceration
            </h3>
            <p className="text-xs sm:text-sm text-[#7A756D] leading-relaxed">
              {settings.aboutCraftsmanship ||
                'Each bottle is macerated for six months in temperature-regulated vaults before being hand-poured into weighted Italian crystal flacons adorned with brushed metal hardware.'}
            </p>
          </div>
        </div>

        {/* Feature Split 2: Ingredients & Sustainability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 order-2 lg:order-1">
            <div className="inline-flex items-center space-x-2 text-[#C5A059] text-xs font-bold uppercase tracking-widest">
              <Leaf className="w-4 h-4" />
              <span>Pure Botanical Absolutes</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#141312]">
              Ethical Ingredients & Reforestation
            </h2>
            <p className="text-xs sm:text-sm text-[#7A756D] leading-relaxed">
              {settings.aboutIngredients ||
                'From wild-foraged Cambodian agarwood to midnight-picked Bulgarian Damask rose, our master perfumers utilize only pure natural absolutes and refined aromatic essences.'}
            </p>

            <h3 className="font-serif text-2xl text-[#141312] pt-4">
              Respect for Earth
            </h3>
            <p className="text-xs sm:text-sm text-[#7A756D] leading-relaxed">
              {settings.aboutSustainability ||
                'All our packaging is FSC-certified, 100% recyclable, and we actively invest in reforestation projects across the regions where our botanicals are cultivated.'}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="px-8 py-3.5 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs tracking-widest font-semibold rounded transition-colors shadow"
              >
                EXPERIENCE THE COLLECTION
              </button>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-white border border-[#E8E2D7] shadow-lg order-1 lg:order-2">
            <img
              src="/images/royal_oud.jpg"
              alt="Precious Raw Absolutes"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
