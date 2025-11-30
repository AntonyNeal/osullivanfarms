// =====================================================
// MobEditPanel - Slide-out panel for editing mob data
// Groups fields by breeding stage for logical editing flow
// =====================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MobEditableData,
  MobCalculatedData,
  EWE_BREED_OPTIONS,
  STATUS_OPTIONS,
  ZONE_OPTIONS,
  TEAM_OPTIONS,
  RAM_BREED_OPTIONS,
  ValidationResult,
} from './types';
import { calculateDerivedFields, formatDate, formatPercent, formatNumber } from './calculations';
import { validateMobData, getFieldError, hasFieldError } from './validation';
import { queueOfflineEdit, isOnline } from './offlineQueue';

interface MobEditPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: MobEditableData;
  onSave: (data: MobEditableData) => Promise<void>;
  mobId: number;
}

type EditSection = 'setup' | 'joining' | 'scanning' | 'marking' | 'weaning';

export default function MobEditPanel({
  isOpen,
  onClose,
  initialData,
  onSave,
  mobId,
}: MobEditPanelProps) {
  const [formData, setFormData] = useState<MobEditableData>(initialData);
  const [calculatedData, setCalculatedData] = useState<MobCalculatedData>({});
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [] });
  const [activeSection, setActiveSection] = useState<EditSection>('setup');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(!isOnline());

  // Reset form when initialData changes
  useEffect(() => {
    setFormData(initialData);
    setSaveError(null);
  }, [initialData]);

  // Recalculate derived fields whenever form data changes
  useEffect(() => {
    const calculated = calculateDerivedFields(formData);
    setCalculatedData(calculated);
  }, [formData]);

  // Validate on change (debounced)
  useEffect(() => {
    const result = validateMobData(formData);
    setValidation(result);
  }, [formData]);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle field change
  const handleChange = useCallback(
    (field: keyof MobEditableData, value: string | number | boolean | null) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // Handle number input
  const handleNumberChange = useCallback(
    (field: keyof MobEditableData, value: string) => {
      const numValue = value === '' ? null : parseFloat(value);
      handleChange(field, numValue);
    },
    [handleChange]
  );

  // Handle save
  const handleSave = async () => {
    if (!validation.isValid) {
      setSaveError('Please fix validation errors before saving');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      if (isOfflineMode) {
        // Queue for later sync
        queueOfflineEdit(mobId, formData);
        onClose();
      } else {
        await onSave(formData);
        onClose();
      }
    } catch (error) {
      if (!isOnline()) {
        // Save to offline queue if we went offline during save
        queueOfflineEdit(mobId, formData);
        setIsOfflineMode(true);
        setSaveError('Saved offline. Will sync when back online.');
      } else {
        setSaveError(error instanceof Error ? error.message : 'Failed to save');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Section tabs
  const sections: { id: EditSection; label: string; icon: string }[] = [
    { id: 'setup', label: 'Setup', icon: '⚙️' },
    { id: 'joining', label: 'Joining', icon: '🐏' },
    { id: 'scanning', label: 'Scanning', icon: '📡' },
    { id: 'marking', label: 'Marking', icon: '✂️' },
    { id: 'weaning', label: 'Weaning', icon: '👶' },
  ];

  // Check if section has errors
  const sectionHasErrors = useMemo(() => {
    const sectionFields: Record<EditSection, (keyof MobEditableData)[]> = {
      setup: [
        'mob_name',
        'ewe_breed',
        'status',
        'zone',
        'current_location',
        'team',
        'shearing_date',
      ],
      joining: ['joining_start', 'ewe_count', 'rams_in', 'ram_breed', 'rams_out', 'joining_finish'],
      scanning: [
        'actual_scanning_date',
        'twins',
        'singles',
        'in_lamb',
        'dry',
        'scanning_percent',
        'pre_lamber_complete',
      ],
      marking: [
        'actual_marking_date',
        'total_ewe_count',
        'wet_ewes',
        'dry_ewes',
        'wethers_terminals',
        'ewe_lambs',
      ],
      weaning: [
        'weaning_date',
        'final_ewe_count_staying',
        'cull_ewe_count',
        'lamb_booster_complete',
        'lambs_sold',
      ],
    };

    const result: Record<EditSection, boolean> = {
      setup: false,
      joining: false,
      scanning: false,
      marking: false,
      weaning: false,
    };

    for (const [section, fields] of Object.entries(sectionFields)) {
      result[section as EditSection] = fields.some((field) => hasFieldError(validation, field));
    }

    return result;
  }, [validation]);

  if (!isOpen) return null;

  // Input field components
  const TextInput = ({
    label,
    field,
    placeholder,
  }: {
    label: string;
    field: keyof MobEditableData;
    placeholder?: string;
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={(formData[field] as string) || ''}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
          hasFieldError(validation, field) ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {hasFieldError(validation, field) && (
        <p className="mt-1 text-sm text-red-600">{getFieldError(validation, field)}</p>
      )}
    </div>
  );

  const NumberInput = ({
    label,
    field,
    placeholder,
    min = 0,
  }: {
    label: string;
    field: keyof MobEditableData;
    placeholder?: string;
    min?: number;
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        value={formData[field] != null ? String(formData[field]) : ''}
        onChange={(e) => handleNumberChange(field, e.target.value)}
        placeholder={placeholder}
        min={min}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
          hasFieldError(validation, field) ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {hasFieldError(validation, field) && (
        <p className="mt-1 text-sm text-red-600">{getFieldError(validation, field)}</p>
      )}
    </div>
  );

  const DateInput = ({ label, field }: { label: string; field: keyof MobEditableData }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="date"
        value={(formData[field] as string) || ''}
        onChange={(e) => handleChange(field, e.target.value || null)}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
          hasFieldError(validation, field) ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {hasFieldError(validation, field) && (
        <p className="mt-1 text-sm text-red-600">{getFieldError(validation, field)}</p>
      )}
    </div>
  );

  const SelectInput = ({
    label,
    field,
    options,
  }: {
    label: string;
    field: keyof MobEditableData;
    options: readonly string[];
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={(formData[field] as string) || ''}
        onChange={(e) => handleChange(field, e.target.value || null)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  const BooleanInput = ({ label, field }: { label: string; field: keyof MobEditableData }) => (
    <div className="mb-4 flex items-center">
      <input
        type="checkbox"
        checked={Boolean(formData[field])}
        onChange={(e) => handleChange(field, e.target.checked)}
        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
      />
      <label className="ml-3 text-sm font-medium text-gray-700">{label}</label>
    </div>
  );

  const CalculatedField = ({
    label,
    value,
    format = 'text',
  }: {
    label: string;
    value: string | number | null | undefined;
    format?: 'text' | 'date' | 'percent' | 'number';
  }) => {
    let displayValue: string;
    if (value == null) {
      displayValue = '-';
    } else if (format === 'date') {
      displayValue = formatDate(value as string);
    } else if (format === 'percent') {
      displayValue = formatPercent(value as number);
    } else if (format === 'number') {
      displayValue = formatNumber(value as number);
    } else {
      displayValue = String(value);
    }

    return (
      <div className="mb-4 bg-gray-100 rounded-lg p-3">
        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
          {label} (Auto-calculated)
        </label>
        <div className="text-lg font-semibold text-gray-600">{displayValue}</div>
      </div>
    );
  };

  // Render section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'setup':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Mob Name" field="mob_name" placeholder="e.g., Mob 1 - Merino Ewes" />
            <SelectInput label="Ewe Breed" field="ewe_breed" options={EWE_BREED_OPTIONS} />
            <SelectInput label="Status" field="status" options={STATUS_OPTIONS} />
            <SelectInput label="Zone" field="zone" options={ZONE_OPTIONS} />
            <TextInput
              label="Location (Paddock)"
              field="current_location"
              placeholder="e.g., Home Paddock"
            />
            <SelectInput label="Team" field="team" options={TEAM_OPTIONS} />
            <DateInput label="Shearing Date" field="shearing_date" />
          </div>
        );

      case 'joining':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateInput label="Joining Start" field="joining_start" />
              <DateInput label="Joining Finish" field="joining_finish" />
              <NumberInput label="Ewe Count" field="ewe_count" placeholder="Number of ewes" />
              <NumberInput label="Rams In" field="rams_in" placeholder="Number of rams" />
              <SelectInput label="Ram Breed" field="ram_breed" options={RAM_BREED_OPTIONS} />
              <NumberInput label="Rams Out" field="rams_out" placeholder="Rams removed" />
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">📊 Calculated Values</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CalculatedField
                  label="Joining Days"
                  value={calculatedData.joining_days}
                  format="number"
                />
                <CalculatedField
                  label="Prescribed Scanning Date"
                  value={calculatedData.prescribed_scanning_date}
                  format="date"
                />
                <CalculatedField
                  label="Expected Lambing Start"
                  value={calculatedData.lambing_start}
                  format="date"
                />
              </div>
            </div>
          </div>
        );

      case 'scanning':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateInput label="Actual Scanning Date" field="actual_scanning_date" />
              <NumberInput label="Twins" field="twins" placeholder="Ewes with twins" />
              <NumberInput label="Singles" field="singles" placeholder="Ewes with singles" />
              <NumberInput label="In Lamb" field="in_lamb" placeholder="Total pregnant" />
              <NumberInput label="Dry" field="dry" placeholder="Not pregnant" />
              <NumberInput label="Scanning %" field="scanning_percent" placeholder="e.g., 158" />
              <BooleanInput label="Pre-Lamber Vaccine Complete" field="pre_lamber_complete" />
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">📊 Projected Dates</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CalculatedField
                  label="Pre-Lamber Vaccine Date"
                  value={calculatedData.pre_lamber_vaccine_date}
                  format="date"
                />
                <CalculatedField
                  label="Lambing Start"
                  value={calculatedData.lambing_start}
                  format="date"
                />
                <CalculatedField
                  label="Lambing End"
                  value={calculatedData.lambing_end}
                  format="date"
                />
              </div>
            </div>
          </div>
        );

      case 'marking':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateInput label="Actual Marking Date" field="actual_marking_date" />
              <NumberInput
                label="Total Ewe Count"
                field="total_ewe_count"
                placeholder="Ewes at marking"
              />
              <NumberInput label="Wet Ewes" field="wet_ewes" placeholder="Ewes that lambed" />
              <NumberInput label="Dry Ewes" field="dry_ewes" placeholder="Ewes that didn't lamb" />
              <NumberInput
                label="Wethers/Terminals"
                field="wethers_terminals"
                placeholder="Male lambs"
              />
              <NumberInput label="Ewe Lambs" field="ewe_lambs" placeholder="Female lambs" />
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">📊 Performance KPIs</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CalculatedField
                  label="Prescribed Marking Date"
                  value={calculatedData.prescribed_marking_date}
                  format="date"
                />
                <CalculatedField
                  label="% Marked"
                  value={calculatedData.percent_marked}
                  format="percent"
                />
                <CalculatedField
                  label="% Marked to Joined"
                  value={calculatedData.percent_marked_to_joined}
                  format="percent"
                />
                <CalculatedField
                  label="% Marked to Scanned"
                  value={calculatedData.percent_marked_to_scanned}
                  format="percent"
                />
                <CalculatedField
                  label="Ewes Lost (Scanning→Marking)"
                  value={calculatedData.ewes_lost_scanning_to_marking}
                  format="number"
                />
              </div>
            </div>
          </div>
        );

      case 'weaning':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateInput label="Weaning Date" field="weaning_date" />
              <NumberInput
                label="Final Ewe Count Staying"
                field="final_ewe_count_staying"
                placeholder="Ewes retained"
              />
              <NumberInput
                label="Cull Ewe Count"
                field="cull_ewe_count"
                placeholder="Ewes culled"
              />
              <BooleanInput label="Lamb Booster Complete" field="lamb_booster_complete" />
              <NumberInput label="Lambs Sold" field="lambs_sold" placeholder="Lambs sold" />
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">📊 Year-End KPIs</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CalculatedField
                  label="Prescribed Weaning Date"
                  value={calculatedData.prescribed_weaning_date}
                  format="date"
                />
                <CalculatedField
                  label="Gross Annual Culls"
                  value={calculatedData.gross_annual_culls}
                  format="number"
                />
                <CalculatedField
                  label="Sale Lambs Remaining"
                  value={calculatedData.sale_lambs_remaining}
                  format="number"
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Edit Mob</h2>
              <p className="text-green-100 text-sm">{formData.mob_name || `Mob ${mobId}`}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Offline indicator */}
          {isOfflineMode && (
            <div className="mt-2 px-3 py-1 bg-amber-500 text-amber-900 rounded-lg text-sm font-medium inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a4 4 0 010-5.656"
                />
              </svg>
              Offline Mode - Changes will sync later
            </div>
          )}
        </div>

        {/* Section Tabs */}
        <div className="flex border-b overflow-x-auto bg-gray-50">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition whitespace-nowrap relative ${
                activeSection === section.id
                  ? 'text-green-600 border-b-2 border-green-600 bg-white'
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-1">{section.icon}</span>
              {section.label}
              {sectionHasErrors[section.id] && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">{renderSectionContent()}</div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4">
          {saveError && (
            <div className="mb-3 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm">
              {saveError}
            </div>
          )}

          {!validation.isValid && (
            <div className="mb-3 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm">
              {validation.errors.length} validation error(s) - please review highlighted fields
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !validation.isValid}
              className={`px-6 py-2 text-white rounded-lg transition font-medium flex items-center ${
                isSaving || !validation.isValid
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Saving...
                </>
              ) : isOfflineMode ? (
                'Save Offline'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
