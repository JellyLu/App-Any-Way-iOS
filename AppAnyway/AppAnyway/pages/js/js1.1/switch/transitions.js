var PageTransitions = (function() {

	var $main = $( '#pt-ct' ),
		$pages = $main.children('div.pt'),
		pagesCount = $pages.length,
		currentPage = 0,
		isAnimating = false,
		endCurrPage = false,
		endNextPage = false,
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		
		// support css animations
		support = Modernizr.cssanimations;
	
	function init() {
		$pages.each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		} );
	
		$pages.eq( currentPage ).addClass( 'pt-current' );
	}

	function getCurrent(){
		return currentPage;
	}
	
	function nextPage( animation ) {
		if( isAnimating ) {
			return false;
		}
		isAnimating = true;
		
		var $currPage = $pages.eq( currentPage );
		
		if( currentPage < pagesCount - 1 ) {
			++currentPage;
		} else {
			currentPage = 0;
		}
		
		var $nextPage = $pages.eq( currentPage ).addClass( 'pt-current' ),
			outClass = '', inClass = '';
		switch( animation ) {  
			case 1:
				outClass = 'pt-moveToLeft';
				inClass = 'pt-moveFromRight';
				break;
			case 2:
				outClass = 'pt-moveToRight';
				inClass = 'pt-moveFromLeft';
				break;
			case 3:
				outClass = 'pt-moveToLeftFade';
				inClass = 'pt-moveFromRightFade';
				break;
			case 4:
				outClass = 'pt-moveToRightFade';
				inClass = 'pt-moveFromLeftFade';
				break;
		}
		
		$currPage.addClass( outClass ).on( animEndEventName, function() {
			$currPage.off( animEndEventName );
			endCurrPage = true;
			if( endNextPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );
		
		$nextPage.addClass( inClass ).on( animEndEventName, function() {
			$nextPage.off( animEndEventName );
			endNextPage = true;
			if( endCurrPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );
		
		if( !support ) {
			onEndAnimation( $currPage, $nextPage );
		}
		
	}

	function onEndAnimation( $outpage, $inpage ) {
		endCurrPage = false;
		endNextPage = false;
		resetPage( $outpage, $inpage );
		isAnimating = false;
	}

	
	function resetPage( $outpage, $inpage ) {
		$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
		$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-current' );
	}

	init();

	return {
			isAnimating:isAnimating,
			//currentPage:currentPage,
			getCurrent:getCurrent,
			nextPage:nextPage
		};
})();