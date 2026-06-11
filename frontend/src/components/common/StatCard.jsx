import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color = 'text-secondary', trend }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="glass-card p-6 flex items-center gap-4"
  >
    <div className={`p-3 rounded-xl bg-white/5 ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-accent text-sm">{label}</p>
      <p className="text-surface text-2xl font-bold">{value?.toLocaleString() ?? '—'}</p>
      {trend !== undefined && (
        <p className={`text-xs mt-1 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? '+' : ''}{trend}% this month
        </p>
      )}
    </div>
  </motion.div>
);

export default StatCard;
