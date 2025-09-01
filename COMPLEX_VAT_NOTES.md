# Complex VAT Schedule Implementation Notes

## Current Status
The following VAT tasks require special scheduling logic beyond simple monthly templates:

### Irish VAT Submission
- **Schedule**: Every 2 months on the 21st
- **Pattern**: Jan-Feb (due Mar 21), Mar-Apr (due May 21), May-Jun (due Jul 21), etc.
- **Implementation needed**: Bi-monthly template system

### UK VAT Submission  
- **Schedule**: Every 3 months (quarterly) on the 1st
- **Pattern**: Dec-Feb (due Apr 1), Mar-May (due Jun 1), Jun-Aug (due Sep 1), Sep-Nov (due Dec 1)
- **Implementation needed**: Quarterly template system

### Australian VAT Submission
- **Schedule**: Every 3 months (quarterly) on the 1st  
- **Pattern**: Jan-Mar (due Apr 1), Apr-Jun (due Jul 1), Jul-Sep (due Oct 1), Oct-Dec (due Jan 1)
- **Implementation needed**: Quarterly template system

## Proposed Solution
Create additional template types:
1. `bi-monthly` templates that generate every 2 months
2. `quarterly` templates that generate every 3 months
3. Enhanced template system to handle these complex schedules

## Temporary Workaround
For now, these can be added as regular monthly templates but will need to be manually managed or deleted on off-months.

## Future Enhancement
Extend the template system to support:
- Custom frequency (every N months)
- Specific month patterns
- Complex due date calculations based on period end dates
