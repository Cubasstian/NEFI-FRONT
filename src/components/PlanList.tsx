// src/components/PlanList.tsx
import React from 'react';

interface PlanListProps {
  onSelectPlan: (plan: string) => void;
}

const PlanList: React.FC<PlanListProps> = ({ onSelectPlan }) => {
  const plans = [
    { name: 'Plan Básico', price: 'Gratis', description: 'Hasta 3 redes sociales visibles' },
    { name: 'Plan Pro', price: '$9.99/mes', description: 'Redes sociales ilimitadas' },
    { name: 'Plan Premium', price: '$19.99/mes', description: 'Redes sociales ilimitadas + soporte prioritario' },
  ];

  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelectPlan(plan.name)}
        >
          <h3 className="text-lg font-medium">{plan.name}</h3>
          <p className="text-gray-600">{plan.price} - {plan.description}</p>
        </div>
      ))}
    </div>
  );
};

export default PlanList;