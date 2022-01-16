import { Twemoji } from 'react-emoji-render'
import { BsDash, BsDashLg, BsPlus, BsPlusLg } from 'react-icons/bs'
import { useParams } from 'react-router-dom'
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Fade,
	Grid,
	IconButton,
	Link,
	Slide,
	styled,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material'
import { throttle } from 'lodash'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { TxType } from '@/types'
import { signWithMetaMaskV4 } from '@/utils/metamask'
import { getSuggestedFee, issueTransaction } from '@/utils/spacesVM'

const SubmitButton = styled(Button)(({ theme }: any) => ({
	backgroundColor: '#523df1',
	padding: theme.spacing(1, 10),
	height: 50,
	fontWeight: 900,
	fontSize: 24,
	position: 'relative',
	boxShadow: '0 0 40px rgb(82 61 241 / 60%)',
	'&:hover': {
		backgroundColor: '#7a68ff',
		boxShadow: '0 0 40px rgb(82 61 241 / 80%)',
	},
	'&.Mui-disabled': {
		backgroundColor: theme.palette.mode === 'dark' ? 'hsla(0,0%,100%,0.1)' : 'hsla(0,0%,0%,0.1)',
	},
}))

type LifelineDialogProps = {
	open: boolean
	close(): void
	existingExpiry: number
	refreshSpaceDetails(): void
}

const checkFee = throttle(async (space, units) => getSuggestedFee({ type: TxType.Lifeline, space, units }), 2000)

export const LifelineDialog = ({ open, close, existingExpiry, refreshSpaceDetails }: LifelineDialogProps) => {
	const { spaceId } = useParams()
	const theme = useTheme()
	const [extendUnits, setExtendUnits] = useState(0)
	const [typedData, setTypedData] = useState<any>()
	const [fee, setFee] = useState(0)
	const [isSigning, setIsSigning] = useState(false)
	const [isDone, setIsDone] = useState(false)

	const onSubmit = async () => {
		setIsSigning(true)
		const signature = await signWithMetaMaskV4(typedData)
		setIsSigning(false)
		if (!signature) return
		const result = await issueTransaction(typedData, signature)
		if (result) setIsDone(true)
		refreshSpaceDetails()
	}

	const extendToDateDisplay = useMemo(() => {
		const now = new Date(existingExpiry * 1000)
		now.setHours(now.getHours() + extendUnits)
		return now.toLocaleString()
	}, [extendUnits, existingExpiry])

	useEffect(() => {
		const _checkFee = async () => {
			const { typedData, totalCost } = await checkFee(spaceId, extendUnits)
			setTypedData(typedData)
			setFee(totalCost)
		}
		_checkFee()
	}, [extendUnits, spaceId, open])

	const handleClose = () => {
		setIsDone(false)
		setExtendUnits(0)
		close()
	}

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="xs">
			<DialogTitle>
				<Typography variant="h5" component="p" fontFamily="DM Serif Display" align="center">
					Extend some life to <span style={{ color: '#e70256' }}>{spaceId}</span> before it expires!{' '}
					<Twemoji svg text=":hourglass:" />
				</Typography>
			</DialogTitle>
			<DialogContent sx={{ mt: 2, overflowY: 'hidden' }}>
				<Typography variant="body1" align="center" color="textSecondary">
					Extend by:
				</Typography>
				<Grid container spacing={1} alignItems={'flex-end'} sx={{ mt: 1 }}>
					<Grid item xs={5} sx={{ mr: 1 }}>
						<Tooltip placement="top" title={`Extend to ${extendToDateDisplay}`}>
							<Typography
								variant="h3"
								align="right"
								lineHeight={1}
								sx={{
									cursor: 'help',
									backgroundSize: '400% 100%',
									backgroundClip: 'text',
									textFillColor: 'transparent',
									backgroundColor: theme.palette.mode === 'dark' ? 'white' : 'unset',
									animation: 'hue 5s infinite alternate',
									backgroundImage:
										'linear-gradient(60deg,rgba(239,0,143,.5),rgba(110,195,244,.5),rgba(112,56,255,.5),rgba(255,186,39,.5))',
								}}
							>
								{extendUnits}
							</Typography>
						</Tooltip>
					</Grid>
					<Divider
						flexItem
						orientation="vertical"
						sx={{
							height: 60,
						}}
					/>
					<Grid item xs={6}>
						<Typography variant="h4" fontSize={1} width={100} lineHeight={1} component="span" color="textSecondary">
							hours
						</Typography>
					</Grid>
				</Grid>
				<Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
					<Button disabled={isDone || extendUnits <= 0} onClick={() => setExtendUnits(Math.max(extendUnits - 24, 0))}>
						<BsDash />
						24
					</Button>
					<IconButton
						disabled={isDone || extendUnits <= 0}
						onClick={() => setExtendUnits(extendUnits - 1)}
						sx={{ ml: 1 }}
					>
						<BsDashLg />
					</IconButton>
					<IconButton disabled={isDone} onClick={() => setExtendUnits(extendUnits + 1)} sx={{ ml: 4 }}>
						<BsPlusLg />
					</IconButton>
					<Button disabled={isDone} onClick={() => setExtendUnits(extendUnits + 24)} sx={{ ml: 1 }}>
						<BsPlus />
						24
					</Button>
				</Box>

				{isDone ? (
					<Slide direction="up" in={isDone}>
						<div style={{ height: 78 }}>
							<Box sx={{ mt: 4, pt: 1, display: 'flex', justifyContent: 'center' }}>
								<Typography
									variant="h5"
									align="right"
									lineHeight={1}
									sx={{
										backgroundSize: '400% 100%',
										backgroundClip: 'text',
										textFillColor: 'transparent',
										backgroundColor: theme.palette.mode === 'dark' ? 'white' : 'unset',
										animation: 'hue 5s infinite alternate',
										backgroundImage:
											'linear-gradient(60deg,rgba(239,0,143,.5),rgba(110,195,244,.5),rgba(112,56,255,.5),rgba(255,186,39,.5))',
									}}
								>
									Lifeline extended!
									<Twemoji svg text=":tada:" />
								</Typography>
							</Box>
							<Typography variant="body1" component="div" align="center" sx={{ mt: 2, cursor: 'pointer' }}>
								<Link onClick={handleClose}>Close</Link>
							</Typography>
						</div>
					</Slide>
				) : (
					<Fade in={!isDone}>
						<div>
							<Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
								<Tooltip placement="top" title={extendUnits <= 0 ? 'Add hours to extend!' : ''}>
									<Box sx={{ cursor: extendUnits <= 0 ? 'help' : 'inherit' }}>
										<SubmitButton disabled={extendUnits <= 0} variant="contained" type="submit" onClick={onSubmit}>
											{isSigning ? (
												<Fade in={isSigning}>
													<img src={MetaMaskFoxLogo} alt="metamask-fox" style={{ height: '100%' }} />
												</Fade>
											) : (
												'Extend Life'
											)}
										</SubmitButton>
									</Box>
								</Tooltip>
							</Box>
							<Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
								<Typography variant="caption">Cost: {fee} SPC</Typography>
							</Box>
						</div>
					</Fade>
				)}
			</DialogContent>
		</Dialog>
	)
}