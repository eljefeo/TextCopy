	public static int eval5(int a,int b,int c,int d,int e){
		int x=(a^b^c^d^e)&8191;
		int y=(a|b|c|d|e)&8191;
		int z=y^x;
		int v=y&y-1;
		if((v&=v-1)==0)
			return (a+b+c+d+e-x&8191)==(8191&(y^x)<<2) 
			  ?0x1C000000|x|z<<13:0x18000000|z|x<<13; //4 of a kind or full house
		else if((v&=v-1)==0)
			return z!=0?0x8000000|x|z<<13
			:0xC000000|(v=((a&b)==(a&8191)?a:(c&d)==(c&8191)?c:e)&8191^y)|v<<13;
		else if((v&=v-1)==0) return 0x4000000|x|z<<13;
		boolean strt=0x1F1D100%y==0,flsh=(a&b&c&d&e)!=0;
		return strt?(x==4111?15:x)|(flsh?0x20000000:0x10000000):flsh?0x14000000:x;
	}  
