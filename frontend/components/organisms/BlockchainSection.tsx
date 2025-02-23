'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SectionTitle from '../atoms/SectionTitle';
import { Wallet, Code, Trophy, Database } from 'lucide-react';
import { useTranslation } from '@/providers/language-provider';

const BlockchainSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Wallet className="w-8 h-8" />,
      translationKey: 'digitalIdentity',
      techDetail: 'mapping(address => Player) internal players'
    },
    {
      icon: <Code className="w-8 h-8" />,
      translationKey: 'levelCreation',
      techDetail: 'mapping(uint256 => Level) public levels'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      translationKey: 'verifiableAchievements',
      techDetail: 'mapping(address => mapping(uint256 => bool)) public playerCompletedLevels'
    },
    {
      icon: <Database className="w-8 h-8" />,
      translationKey: 'globalStats',
      techDetail: 'mapping(address => uint256) public playerLevelCount'
    }
  ];

  return (
    <section className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <SectionTitle className="text-center mb-12">
          {t('blockchain.title')}
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-primary">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {t(`blockchain.${feature.translationKey}.title`)}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {t(`blockchain.${feature.translationKey}.description`)}
                    </p>
                    <code className="text-xs bg-slate-800 p-2 rounded-lg block text-green-400">
                      {feature.techDetail}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlockchainSection; 