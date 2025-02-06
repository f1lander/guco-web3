'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const ecosystemPartners = [
  { name: 'Partner 1', logo: 'https://cdn.prod.website-files.com/660ae9fcc3ed0ee961b422c9/6627ca5be01d3f2e1b4ced0d_Frame%20513786.svg' },
  { name: 'Partner 2', logo: 'https://cdn.prod.website-files.com/660ae9fcc3ed0ee961b422c9/6627ca64c6ccc06c2fc62836_Frame%20513787.svg' },
  { name: 'Partner 3', logo: 'https://cdn.prod.website-files.com/660ae9fcc3ed0ee961b422c9/6627ca6f596dfebdbda4f63e_Frame%20513788.svg' },
  { name: 'Partner 4', logo: 'https://cdn.prod.website-files.com/660ae9fcc3ed0ee961b422c9/6627ca7b39fd96b5150b41da_Frame%20513789.svg' },
  { name: 'Partner 5', logo: 'https://cdn.prod.website-files.com/660ae9fcc3ed0ee961b422c9/6627ca846ac4f28f290dfda7_Frame%20513790.svg' },
  { name: 'Partner 6', logo: 'https://cdn.prod.website-files.com/660ae9fcc3ed0ee961b422c9/6627ca8e1de9adacf45f2cac_Frame%20513791.svg' },
  { name: 'Partner 7', logo: 'https://cdn.prod.website-files.com/660ae9fcc3ed0ee961b422c9/6627ca98a7e1e540103802a1_Frame%20513792.svg' },
  { name: 'Partner 8', logo: 'https://cdn.prod.website-files.com/660ae9fcc3ed0ee961b422c9/6627cb0cefa3f3bc3733dd06__altme.png' },
  { name: 'Partner 9', logo: 'https://cdn.prod.website-files.com/660ae9fcc3ed0ee961b422c9/6627cb150ed31832a3d4ed3d__amrit.png' },
  { name: 'Partner 10', logo: 'https://cdn.prod.website-files.com/660ae9fcc3ed0ee961b422c9/6627cb1fc8249e8b8d33234c__chaintool.webp' },
];

const EcosystemMap = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16">
          Ecosystem
        </h2>

        <div className="relative max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-5 gap-8 md:gap-12">
            {ecosystemPartners.map((partner, index) => (
              <div
                key={partner.name}
                className="group relative aspect-square hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="absolute inset-0 bg-background/5 rounded-full backdrop-blur-sm group-hover:bg-background/10 transition-colors" />
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="p-4 cursor-pointer rounded-full object-contain hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-guco-500 text-black hover:bg-guco-600 text-lg px-8 py-6 rounded-full"
          >
            Explore ecosystem
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EcosystemMap;